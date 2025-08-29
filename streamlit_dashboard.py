import streamlit as st
import pandas as pd
import json
import requests
from datetime import datetime, timedelta
import time
from typing import List, Dict, Optional

# Page configuration
st.set_page_config(
    page_title="AI Medical Centre Dashboard",
    page_icon="📞",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #1e40af 0%, #3b82f6 100%);
        padding: 1rem;
        border-radius: 10px;
        color: white;
        margin-bottom: 2rem;
    }
    
    .metric-card {
        background: white;
        padding: 1rem;
        border-radius: 10px;
        border: 1px solid #e5e7eb;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .conversation-card {
        background: white;
        padding: 1rem;
        border-radius: 10px;
        border-left: 4px solid #3b82f6;
        margin-bottom: 1rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .active-call {
        border-left-color: #10b981;
        animation: pulse 2s infinite;
    }
    
    .completed-call {
        border-left-color: #3b82f6;
    }
    
    .error-call {
        border-left-color: #ef4444;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    .transcript-ai {
        background: #eff6ff;
        border-left: 3px solid #3b82f6;
        padding: 0.5rem;
        margin: 0.5rem 0;
        border-radius: 5px;
    }
    
    .transcript-client {
        background: #f9fafb;
        border-left: 3px solid #6b7280;
        padding: 0.5rem;
        margin: 0.5rem 0;
        border-radius: 5px;
    }
</style>
""", unsafe_allow_html=True)

class ConversationManager:
    def __init__(self):
        self.api_base_url = "http://localhost:5050"
        
    def get_mock_conversations(self) -> List[Dict]:
        """Generate mock conversation data for demonstration"""
        now = datetime.now()
        
        conversations = [
            {
                "id": "conv_001",
                "client_phone": "+1-555-0123",
                "start_time": (now - timedelta(minutes=5)).isoformat(),
                "end_time": None,
                "status": "active",
                "duration": 300,
                "summary": "Client calling to schedule an appointment with Dr. Smith for next week. Currently collecting patient information.",
                "appointment_details": None,
                "transcript": [
                    {
                        "id": "msg_001",
                        "timestamp": (now - timedelta(minutes=5)).isoformat(),
                        "speaker": "ai",
                        "message": "Hello there! I am Jane from Medical Centre. How can I assist you today?",
                        "confidence": 0.95
                    },
                    {
                        "id": "msg_002", 
                        "timestamp": (now - timedelta(minutes=4, seconds=30)).isoformat(),
                        "speaker": "client",
                        "message": "Hi, I would like to schedule an appointment with Dr. Smith.",
                        "confidence": 0.92
                    },
                    {
                        "id": "msg_003",
                        "timestamp": (now - timedelta(minutes=4)).isoformat(),
                        "speaker": "ai", 
                        "message": "I'd be happy to help you schedule an appointment with Dr. Smith. May I have your full name please?",
                        "confidence": 0.97
                    }
                ]
            },
            {
                "id": "conv_002",
                "client_phone": "+1-555-0456", 
                "start_time": (now - timedelta(hours=1)).isoformat(),
                "end_time": (now - timedelta(minutes=50)).isoformat(),
                "status": "completed",
                "duration": 600,
                "summary": "Successfully scheduled appointment with Dr. Johnson for patient John Doe.",
                "appointment_details": {
                    "docname": "Johnson",
                    "name": "John Doe", 
                    "phone": "+1-555-0456",
                    "appointment_datetime": "Tomorrow 2:00 PM"
                },
                "transcript": [
                    {
                        "id": "msg_004",
                        "timestamp": (now - timedelta(hours=1)).isoformat(),
                        "speaker": "ai",
                        "message": "Hello there! I am Jane from Medical Centre. How can I assist you today?",
                        "confidence": 0.98
                    },
                    {
                        "id": "msg_005",
                        "timestamp": (now - timedelta(minutes=59)).isoformat(), 
                        "speaker": "client",
                        "message": "I need to book an appointment with Dr. Johnson.",
                        "confidence": 0.94
                    },
                    {
                        "id": "msg_006",
                        "timestamp": (now - timedelta(minutes=58)).isoformat(),
                        "speaker": "ai",
                        "message": "Perfect! I can help you schedule with Dr. Johnson. What's your full name?",
                        "confidence": 0.96
                    },
                    {
                        "id": "msg_007", 
                        "timestamp": (now - timedelta(minutes=57)).isoformat(),
                        "speaker": "client",
                        "message": "My name is John Doe.",
                        "confidence": 0.93
                    }
                ]
            },
            {
                "id": "conv_003",
                "client_phone": "+1-555-0789",
                "start_time": (now - timedelta(hours=2)).isoformat(),
                "end_time": (now - timedelta(hours=1, minutes=55)).isoformat(), 
                "status": "error",
                "duration": 300,
                "summary": "Call ended unexpectedly during appointment scheduling process.",
                "appointment_details": None,
                "transcript": [
                    {
                        "id": "msg_008",
                        "timestamp": (now - timedelta(hours=2)).isoformat(),
                        "speaker": "ai", 
                        "message": "Hello there! I am Jane from Medical Centre. How can I assist you today?",
                        "confidence": 0.89
                    },
                    {
                        "id": "msg_009",
                        "timestamp": (now - timedelta(hours=1, minutes=58)).isoformat(),
                        "speaker": "client",
                        "message": "I want to... [connection lost]",
                        "confidence": 0.45
                    }
                ]
            }
        ]
        
        return conversations

    def get_conversations(self) -> List[Dict]:
        """Fetch conversations from API or return mock data"""
        try:
            # Try to fetch from actual API
            response = requests.get(f"{self.api_base_url}/conversations", timeout=5)
            if response.status_code == 200:
                return response.json()
        except:
            pass
        
        # Return mock data if API is not available
        return self.get_mock_conversations()

def main():
    # Initialize conversation manager
    conv_manager = ConversationManager()
    
    # Header
    st.markdown("""
    <div class="main-header">
        <h1>📞 AI Medical Centre Dashboard</h1>
        <p>Real-time conversation monitoring and appointment management</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Sidebar
    with st.sidebar:
        st.header("🔧 Controls")
        
        # Auto-refresh toggle
        auto_refresh = st.checkbox("Auto Refresh", value=True)
        refresh_interval = st.slider("Refresh Interval (seconds)", 5, 60, 10)
        
        # Manual refresh button
        if st.button("🔄 Refresh Now", use_container_width=True):
            st.rerun()
        
        # Filters
        st.header("🔍 Filters")
        status_filter = st.selectbox(
            "Status",
            ["All", "Active", "Completed", "Error"]
        )
        
        phone_search = st.text_input("Search by Phone Number")
        
        st.header("📊 Quick Stats")
        
    # Get conversations
    conversations = conv_manager.get_conversations()
    
    # Apply filters
    filtered_conversations = conversations.copy()
    
    if status_filter != "All":
        filtered_conversations = [c for c in filtered_conversations if c["status"].lower() == status_filter.lower()]
    
    if phone_search:
        filtered_conversations = [c for c in filtered_conversations if phone_search in c["client_phone"]]
    
    # Calculate statistics
    total_calls = len(conversations)
    active_calls = len([c for c in conversations if c["status"] == "active"])
    completed_calls = len([c for c in conversations if c["status"] == "completed"])
    error_calls = len([c for c in conversations if c["status"] == "error"])
    
    avg_duration = 0
    if conversations:
        durations = [c["duration"] for c in conversations if c["duration"]]
        avg_duration = sum(durations) / len(durations) if durations else 0
    
    # Display metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(
            label="📞 Total Calls",
            value=total_calls,
            delta=f"+{len([c for c in conversations if (datetime.now() - datetime.fromisoformat(c['start_time'].replace('Z', '+00:00').replace('+00:00', ''))).total_seconds() < 3600])}" if conversations else None
        )
    
    with col2:
        st.metric(
            label="🟢 Active Calls", 
            value=active_calls,
            delta="Live" if active_calls > 0 else None
        )
    
    with col3:
        st.metric(
            label="✅ Completed",
            value=completed_calls
        )
    
    with col4:
        st.metric(
            label="⏱️ Avg Duration",
            value=f"{int(avg_duration//60)}m {int(avg_duration%60)}s" if avg_duration > 0 else "0s"
        )
    
    # Update sidebar stats
    with st.sidebar:
        st.metric("Total Conversations", total_calls)
        st.metric("Success Rate", f"{(completed_calls/total_calls*100):.1f}%" if total_calls > 0 else "0%")
        if error_calls > 0:
            st.error(f"⚠️ {error_calls} calls with errors")
    
    # Main content
    st.header("💬 Recent Conversations")
    
    if not filtered_conversations:
        st.info("No conversations found matching your filters.")
        return
    
    # Conversation tabs
    tab1, tab2 = st.tabs(["📋 Summary View", "📝 Detailed View"])
    
    with tab1:
        # Display conversations in a grid
        for i in range(0, len(filtered_conversations), 2):
            cols = st.columns(2)
            
            for j, col in enumerate(cols):
                if i + j < len(filtered_conversations):
                    conv = filtered_conversations[i + j]
                    
                    with col:
                        # Status indicator
                        status_emoji = {
                            "active": "🟢",
                            "completed": "✅", 
                            "error": "❌"
                        }
                        
                        status_color = {
                            "active": "success",
                            "completed": "info",
                            "error": "error"
                        }
                        
                        with st.container():
                            st.markdown(f"""
                            <div class="conversation-card {conv['status']}-call">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                    <strong>📞 {conv['client_phone']}</strong>
                                    <span>{status_emoji[conv['status']]} {conv['status'].title()}</span>
                                </div>
                            </div>
                            """, unsafe_allow_html=True)
                            
                            # Time info
                            start_time = datetime.fromisoformat(conv['start_time'].replace('Z', '+00:00').replace('+00:00', ''))
                            time_ago = datetime.now() - start_time
                            
                            if time_ago.total_seconds() < 3600:
                                time_str = f"{int(time_ago.total_seconds()//60)} minutes ago"
                            else:
                                time_str = f"{int(time_ago.total_seconds()//3600)} hours ago"
                            
                            st.caption(f"🕒 {time_str}")
                            
                            if conv["duration"]:
                                st.caption(f"⏱️ Duration: {conv['duration']//60}m {conv['duration']%60}s")
                            
                            # Summary
                            st.write(conv["summary"])
                            
                            # Appointment details if available
                            if conv.get("appointment_details"):
                                apt = conv["appointment_details"]
                                st.success(f"""
                                **📅 Appointment Scheduled:**
                                - **Patient:** {apt['name']}
                                - **Doctor:** Dr. {apt['docname']}
                                - **Time:** {apt['appointment_datetime']}
                                - **Phone:** {apt['phone']}
                                """)
                            
                            # View details button
                            if st.button(f"View Details", key=f"details_{conv['id']}"):
                                st.session_state.selected_conversation = conv['id']
    
    with tab2:
        # Conversation selection
        conv_options = {f"{c['client_phone']} - {c['status']}": c['id'] for c in filtered_conversations}
        
        if conv_options:
            selected_conv_key = st.selectbox(
                "Select Conversation",
                options=list(conv_options.keys()),
                key="conv_selector"
            )
            
            selected_conv_id = conv_options[selected_conv_key]
            selected_conv = next(c for c in filtered_conversations if c['id'] == selected_conv_id)
            
            # Display detailed conversation
            display_conversation_details(selected_conv)

def display_conversation_details(conversation: Dict):
    """Display detailed view of a conversation"""
    
    # Header
    col1, col2, col3 = st.columns([2, 1, 1])
    
    with col1:
        st.subheader(f"📞 {conversation['client_phone']}")
    
    with col2:
        status_color = {
            "active": "🟢",
            "completed": "✅",
            "error": "❌"
        }
        st.markdown(f"**Status:** {status_color[conversation['status']]} {conversation['status'].title()}")
    
    with col3:
        start_time = datetime.fromisoformat(conversation['start_time'].replace('Z', '+00:00').replace('+00:00', ''))
        st.markdown(f"**Started:** {start_time.strftime('%H:%M:%S')}")
    
    # Summary section
    st.markdown("### 📋 Summary")
    st.info(conversation["summary"])
    
    # Appointment details
    if conversation.get("appointment_details"):
        st.markdown("### 📅 Appointment Details")
        apt = conversation["appointment_details"]
        
        col1, col2 = st.columns(2)
        with col1:
            st.markdown(f"""
            **👤 Patient Information:**
            - **Name:** {apt['name']}
            - **Phone:** {apt['phone']}
            """)
        
        with col2:
            st.markdown(f"""
            **🏥 Appointment Details:**
            - **Doctor:** Dr. {apt['docname']}
            - **Date & Time:** {apt['appointment_datetime']}
            """)
    
    # Transcript section
    if conversation.get("transcript"):
        st.markdown("### 💬 Conversation Transcript")
        
        transcript_container = st.container()
        
        with transcript_container:
            for msg in conversation["transcript"]:
                timestamp = datetime.fromisoformat(msg['timestamp'].replace('Z', '+00:00').replace('+00:00', ''))
                time_str = timestamp.strftime('%H:%M:%S')
                
                if msg["speaker"] == "ai":
                    st.markdown(f"""
                    <div class="transcript-ai">
                        <strong>🤖 AI Assistant</strong> <small>({time_str})</small><br>
                        {msg['message']}
                        {f'<br><small>Confidence: {msg.get("confidence", 0)*100:.1f}%</small>' if msg.get("confidence") else ''}
                    </div>
                    """, unsafe_allow_html=True)
                else:
                    st.markdown(f"""
                    <div class="transcript-client">
                        <strong>👤 Client</strong> <small>({time_str})</small><br>
                        {msg['message']}
                        {f'<br><small>Confidence: {msg.get("confidence", 0)*100:.1f}%</small>' if msg.get("confidence") else ''}
                    </div>
                    """, unsafe_allow_html=True)

def display_real_time_updates():
    """Display real-time updates section"""
    st.markdown("### 🔄 Real-time Updates")
    
    # Create placeholder for updates
    updates_placeholder = st.empty()
    
    # Mock real-time updates
    updates = [
        {"time": datetime.now().strftime('%H:%M:%S'), "message": "New call received from +1-555-0999"},
        {"time": (datetime.now() - timedelta(minutes=2)).strftime('%H:%M:%S'), "message": "Appointment scheduled for Sarah Johnson"},
        {"time": (datetime.now() - timedelta(minutes=5)).strftime('%H:%M:%S'), "message": "Call completed successfully"},
    ]
    
    with updates_placeholder.container():
        for update in updates:
            st.markdown(f"**{update['time']}** - {update['message']}")

# Main app
def app():
    # Auto-refresh logic
    if 'last_refresh' not in st.session_state:
        st.session_state.last_refresh = time.time()
    
    # Check if we should auto-refresh
    if hasattr(st.session_state, 'auto_refresh') and st.session_state.get('auto_refresh', True):
        if time.time() - st.session_state.last_refresh > 10:  # Refresh every 10 seconds
            st.session_state.last_refresh = time.time()
            st.rerun()
    
    # Main dashboard
    main()
    
    # Real-time updates in sidebar
    with st.sidebar:
        st.markdown("---")
        display_real_time_updates()
        
        st.markdown("---")
        st.markdown("### 🔗 Quick Actions")
        
        if st.button("📊 Export Data", use_container_width=True):
            # Mock export functionality
            st.success("Data exported successfully!")
        
        if st.button("⚙️ Settings", use_container_width=True):
            st.info("Settings panel coming soon!")
        
        # Connection status
        st.markdown("### 🌐 Connection Status")
        try:
            # Try to ping the backend
            response = requests.get("http://localhost:5050/", timeout=2)
            if response.status_code == 200:
                st.success("🟢 Backend Connected")
            else:
                st.error("🔴 Backend Error")
        except:
            st.warning("🟡 Using Mock Data")

if __name__ == "__main__":
    app()