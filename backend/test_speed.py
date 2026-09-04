import time
import asyncio
from agent_workflow import builder

async def main():
    text = "Hello! I recently bought your new smartphone, and I absolutely love it! The camera is fantastic, though the battery life could be a little better. My phone number is 555-0199 and email is customer@example.com."
    
    print("Compiling graph without checkpointer for speed test...")
    graph = builder.compile()
    
    print("Starting AI Workflow...")
    start = time.time()
    try:
        result = await graph.ainvoke({"text": text})
        end = time.time()
        print(f"\n--- TIMING RESULTS ---")
        print(f"Total Workflow Execution Time: {end - start:.2f} seconds.")
        print("--- EXTRACTED DATA ---")
        if "analysis_result" in result:
            import json
            print(json.dumps(result["analysis_result"], indent=2))
        else:
            print("No analysis result found. Result dump:", result)
    except Exception as e:
        print("\n!!! Error during analysis:", str(e))

if __name__ == "__main__":
    asyncio.run(main())
