import os
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.future import select
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver

from auth import auth_router, get_password_hash, get_current_active_user
from models import User, TextPayload, DBUser
from database import Base, engine, AsyncSessionLocal, DATABASE_URL
from agent_workflow import builder

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB Tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    # Setup Checkpointer Tables
    async with AsyncPostgresSaver.from_conn_string(DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")) as saver:
        await saver.setup()
        
    # Insert a single Mock Admin User if not exists
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(DBUser).where(DBUser.username == "admin"))
        if not result.scalars().first():
            admin_user = DBUser(
                username="admin", 
                role="admin", 
                hashed_password=get_password_hash("admin123"), 
                email="admin@example.com"
            )
            session.add(admin_user)
            await session.commit()
    yield

app = FastAPI(title="Sentiment Analyzer API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://tataprasadshindeassignment.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Sentiment Analyzer API is running."}

@app.post("/api/analyze")
async def analyze_text(
    payload: TextPayload, 
    current_user: DBUser = Depends(get_current_active_user)
):
    # Compile graph statelessly (no PostgresSaver overhead)
    graph = builder.compile()
    final_state = await graph.ainvoke({"text": payload.text})
    
    return {
        "status": "complete",
        "analysis": final_state.get("analysis_result"),
        "eval_score": final_state.get("eval_score"),
        "errors": final_state.get("errors", [])
    }

@app.get("/api/results/{thread_id}")
async def get_results(
    thread_id: str,
    current_user: DBUser = Depends(get_current_active_user)
):
    config = {"configurable": {"thread_id": thread_id}}
    async with AsyncPostgresSaver.from_conn_string(DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")) as checkpointer:
        graph = builder.compile(checkpointer=checkpointer)
        state = await graph.aget_state(config)
        
    if not state or not state.values:
        return {"status": "processing"}
        
    # Check if analysis is complete
    analysis = state.values.get("analysis_result")
    if analysis:
        return {
            "status": "complete",
            "analysis": analysis,
            "eval_score": state.values.get("eval_score"),
            "errors": state.values.get("errors", [])
        }
    else:
        return {"status": "processing"}
