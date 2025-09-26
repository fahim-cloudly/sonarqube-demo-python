# frontend/app.py
import streamlit as st
import requests
import os

# Backend URL (default: local FastAPI server)
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

st.set_page_config(page_title="Medical Chatbot", page_icon="💊", layout="wide")

# Custom CSS for Deep Blue Theme
st.markdown("""
<style>
    /* Greyish Black Solid Background */
    .stApp {
        background: #2d2d2d !important;  /* Greyish black solid color */
        min-height: 100vh;
    }
    
    /* Main container styling */
    .main .block-container {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 2rem;
        margin-top: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    /* Chat message styling */
    .stChatMessage {
        background: rgba(255, 255, 255, 0.1) !important;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 15px;
        margin: 15px 0;
        padding: 20px;
        backdrop-filter: blur(15px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    
    /* User message styling */
    .stChatMessage[data-testid*="user"] {
        background: rgba(255, 255, 255, 0.15) !important;
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1);
    }
    
    /* Assistant message styling */
    .stChatMessage[data-testid*="assistant"] {
        background: rgba(255, 255, 255, 0.1) !important;
        border: 1px solid rgba(255, 255, 255, 0.25);
        box-shadow: 0 4px 20px rgba(255, 255, 255, 0.05);
    }
    
    /* Title styling */
    .main h1 {
        font-size: 3.5rem !important;
        color: #ffffff !important;
        text-align: center;
        margin-bottom: 1rem;
        text-shadow: 0 4px 8px rgba(0,0,0,0.3);
        font-weight: 700;
    }
    
    /* Subtitle styling */
    .main p {
        font-size: 1.4rem !important;
        color: #ffffff !important;
        text-align: center;
        margin-bottom: 2rem;
        text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    /* Chat input styling - More specific targeting */
    .stChatInputContainer, .stChatInputContainer > div, [data-testid="stChatInputContainer"] {
        background: rgba(255, 255, 255, 0.1) !important;
        border: 2px solid rgba(255, 255, 255, 0.3) !important;
        border-radius: 25px !important;
        backdrop-filter: blur(15px) !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
    }
    
    /* Target the actual input field */
    .stChatInputContainer input, [data-testid="stChatInputContainer"] input, 
    .stChatInputContainer textarea, [data-testid="stChatInputContainer"] textarea {
        font-size: 1.2rem !important;
        color: #ffffff !important;
        background: transparent !important;
        border: none !important;
    }
    
    /* Placeholder text */
    .stChatInputContainer input::placeholder, .stChatInputContainer textarea::placeholder,
    [data-testid="stChatInputContainer"] input::placeholder, [data-testid="stChatInputContainer"] textarea::placeholder {
        color: rgba(255, 255, 255, 0.7) !important;
    }
    
    /* Chat input wrapper */
    .stBottom, .stBottom > div, [data-testid="stBottom"] {
        background: #2d2d2d !important;
    }
    
    /* Additional targeting for chat input area */
    div[data-testid="stVerticalBlock"] div[data-testid="stVerticalBlock"]:last-child {
        background: #2d2d2d !important;
    }
    
    /* Message text styling */
    .stChatMessage p, .stChatMessage div {
        font-size: 1.25rem !important;
        line-height: 1.7 !important;
        color: #ffffff !important;
        text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    
    /* Sources styling */
    .stChatMessage strong {
        color: #ffffff !important;
        font-size: 1.2rem !important;
        text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }
    
    .stChatMessage ul li {
        font-size: 1.1rem !important;
        color: #ffffff !important;
        margin-bottom: 8px;
        text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    
    /* Spinner styling */
    .stSpinner > div {
        border-top-color: #ffffff !important;
    }
    
    /* Error message styling */
    .stAlert {
        background: rgba(239, 68, 68, 0.2) !important;
        border: 1px solid rgba(239, 68, 68, 0.4);
        border-radius: 12px;
        font-size: 1.1rem !important;
        color: #ffffff !important;
        backdrop-filter: blur(10px);
    }
    
    /* Success message styling */
    .stSuccess {
        background: rgba(34, 197, 94, 0.2) !important;
        border: 1px solid rgba(34, 197, 94, 0.4);
        color: #ffffff !important;
    }
    
    /* Sidebar styling (if used) */
    .css-1d391kg {
        background: #2d2d2d;
        backdrop-filter: blur(10px);
    }
    
    /* Avatar styling */
    .stChatMessage img {
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    
    /* All text elements white */
    .stMarkdown, .stText, .element-container p, .element-container div {
        color: #ffffff !important;
    }
    
    /* Remove Streamlit menu and footer */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    
    /* Scrollbar styling */
    ::-webkit-scrollbar {
        width: 8px;
    }
    
    ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.5);
    }
</style>
""", unsafe_allow_html=True)

st.title("💊 Medical Chatbot")
st.write("Ask me about drugs, side effects, treatments, and more.")

# Initialize chat history in session state
if "messages" not in st.session_state:
    st.session_state["messages"] = []

# --- Display Chat Messages ---
for msg in st.session_state["messages"]:
    if msg["role"] == "user":
        with st.chat_message("user", avatar="🧑‍⚕️"):
            st.markdown(f"**You:** {msg['content']}")
    else:
        with st.chat_message("assistant", avatar="🤖"):
            st.markdown(f"**Medical Assistant:** {msg['content']}")
            if "sources" in msg and msg["sources"]:
                st.markdown("**📚 Sources:**")
                for src in msg["sources"]:
                    st.markdown(f"• {src}")

# --- Chat Input Box ---
if question := st.chat_input("💬 Type your medical question here..."):
    # Add user message
    st.session_state["messages"].append({"role": "user", "content": question})

    # Display user message immediately
    with st.chat_message("user", avatar="🧑‍⚕️"):
        st.markdown(f"**You:** {question}")

    # Query backend
    with st.chat_message("assistant", avatar="🤖"):
        with st.spinner("🔍 Analyzing your question..."):
            try:
                response = requests.post(
                    f"{BACKEND_URL}/api/ask",
                    json={"question": question, "top_k": 5}
                )

                if response.status_code == 200:
                    data = response.json()
                    answer = data["answer"]
                    st.markdown(f"**Medical Assistant:** {answer}")

                    if data.get("sources"):
                        st.markdown("**📚 Sources:**")
                        for src in data["sources"]:
                            st.markdown(f"• {src}")

                    # Save bot response in history
                    st.session_state["messages"].append(
                        {
                            "role": "assistant",
                            "content": answer,
                            "sources": data.get("sources", []),
                        }
                    )
                else:
                    error_msg = f"⚠️ Server Error: {response.text}"
                    st.error(error_msg)
                    st.session_state["messages"].append(
                        {"role": "assistant", "content": error_msg}
                    )
            except Exception as e:
                error_msg = f"❌ Connection Failed: Unable to reach the medical database. Please try again later."
                st.error(error_msg)
                st.session_state["messages"].append(
                    {"role": "assistant", "content": error_msg}
                )

# Add a footer with medical disclaimer
# st.markdown("""
# ---
# <div style='text-align: center; color: rgba(255, 255, 255, 0.8); font-size: 1rem; padding: 20px; 
#      background: rgba(255, 255, 255, 0.1); border-radius: 15px; backdrop-filter: blur(10px); 
#      border: 1px solid rgba(255, 255, 255, 0.2); margin-top: 30px;'>
# <strong>⚠️ Medical Disclaimer:</strong> This chatbot provides general information only and is not a substitute for professional medical advice, diagnosis, or treatment.
# </div>
# """, unsafe_allow_html=True)