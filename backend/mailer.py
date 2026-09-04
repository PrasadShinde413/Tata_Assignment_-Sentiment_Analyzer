import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def send_approval_email(thread_id: str, content_preview: str):
    if not SMTP_USERNAME or not SMTP_PASSWORD:
        print("SMTP Credentials not set. Skipping email.")
        return

    msg = MIMEMultipart()
    msg['From'] = SMTP_USERNAME
    msg['To'] = SMTP_USERNAME  # Send to self (the reviewer/admin) for demo
    msg['Subject'] = f"Action Required: HITL Review for Analysis Thread {thread_id}"

    body = f"""
    A new conversation analysis has been processed and requires your approval.
    
    Thread ID: {thread_id}
    
    Preview of content:
    {content_preview[:200]}...
    
    Please log in to the Sentiment Analyzer dashboard to review and approve the analysis.
    http://localhost:3000/reviewer
    """
    
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        text = msg.as_string()
        server.sendmail(SMTP_USERNAME, SMTP_USERNAME, text)
        server.quit()
        print(f"Approval email sent for thread {thread_id}")
    except Exception as e:
        print(f"Failed to send email: {e}")

if __name__ == "__main__":
    send_approval_email("test_123", "This is a test conversation...")
