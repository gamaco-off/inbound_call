#!/usr/bin/env python3
"""
Script to run the Streamlit dashboard
"""

import subprocess
import sys
import os

def main():
    """Run the Streamlit dashboard"""
    
    print("🚀 Starting AI Medical Centre Dashboard...")
    print("📊 Dashboard will be available at: http://localhost:8501")
    print("🔄 Auto-refresh enabled for real-time updates")
    print("\n" + "="*50)
    
    try:
        # Run streamlit
        subprocess.run([
            sys.executable, "-m", "streamlit", "run", 
            "streamlit_dashboard.py",
            "--server.port=8501",
            "--server.address=0.0.0.0",
            "--theme.primaryColor=#3b82f6",
            "--theme.backgroundColor=#ffffff",
            "--theme.secondaryBackgroundColor=#f8fafc"
        ], check=True)
        
    except KeyboardInterrupt:
        print("\n👋 Dashboard stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running dashboard: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()