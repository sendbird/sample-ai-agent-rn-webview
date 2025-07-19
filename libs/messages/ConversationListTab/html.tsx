export const ConversationListHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Agent Chat</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f5f5f5;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .header {
            background: #742DDD;
            color: white;
            padding: 16px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .header-title {
            font-size: 18px;
            font-weight: 600;
        }
        .back-button {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
        }
        .chat-container {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }
        .message {
            margin-bottom: 16px;
            max-width: 80%;
        }
        .message.user {
            margin-left: auto;
        }
        .message.ai {
            margin-right: auto;
        }
        .message-bubble {
            padding: 12px 16px;
            border-radius: 18px;
            word-wrap: break-word;
        }
        .message.user .message-bubble {
            background: #742DDD;
            color: white;
        }
        .message.ai .message-bubble {
            background: white;
            color: #333;
            border: 1px solid #e0e0e0;
        }
        .message-time {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
            text-align: right;
        }
        .message.ai .message-time {
            text-align: left;
        }
        .input-container {
            background: white;
            padding: 16px 20px;
            border-top: 1px solid #e0e0e0;
            display: flex;
            gap: 12px;
            align-items: center;
        }
        .message-input {
            flex: 1;
            border: 1px solid #e0e0e0;
            border-radius: 20px;
            padding: 12px 16px;
            font-size: 16px;
            outline: none;
        }
        .send-button {
            background: #742DDD;
            color: white;
            border: none;
            border-radius: 50%;
            width: 44px;
            height: 44px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }
        .send-button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .typing-indicator {
            display: none;
            align-items: center;
            gap: 8px;
            color: #666;
            font-style: italic;
            margin-bottom: 16px;
        }
        .typing-dots {
            display: flex;
            gap: 2px;
        }
        .dot {
            width: 4px;
            height: 4px;
            background: #666;
            border-radius: 50%;
            animation: typing 1.4s infinite;
        }
        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing {
            0%, 60%, 100% { opacity: 0.2; }
            30% { opacity: 1; }
        }
    </style>
</head>
<body>
    <div class="header">
        <button class="back-button" onclick="goBack()">← Back</button>
        <div class="header-title">AI Assistant</div>
        <div></div>
    </div>
    
    <div class="chat-container" id="chatContainer">
        <div class="message ai">
            <div class="message-bubble">
                Hello! I'm your AI assistant. How can I help you today?
            </div>
            <div class="message-time">Just now</div>
        </div>
        
        <div class="typing-indicator" id="typingIndicator">
            <span>AI is typing</span>
            <div class="typing-dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
    </div>
    
    <div class="input-container">
        <input 
            type="text" 
            class="message-input" 
            id="messageInput" 
            placeholder="Type your message..."
            onkeypress="handleKeyPress(event)"
        >
        <button class="send-button" onclick="sendMessage()">→</button>
    </div>

    <script>
        function goBack() {
            window.ReactNativeWebView.postMessage('goBack');
        }
        
        function getCurrentTime() {
            const now = new Date();
            return now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }
        
        function addMessage(text, isUser = false) {
            const chatContainer = document.getElementById('chatContainer');
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${isUser ? 'user' : 'ai'}\`;
            
            messageDiv.innerHTML = \`
                <div class="message-bubble">\${text}</div>
                <div class="message-time">\${getCurrentTime()}</div>
            \`;
            
            const typingIndicator = document.getElementById('typingIndicator');
            chatContainer.insertBefore(messageDiv, typingIndicator);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
        
        function showTypingIndicator() {
            document.getElementById('typingIndicator').style.display = 'flex';
            document.getElementById('chatContainer').scrollTop = document.getElementById('chatContainer').scrollHeight;
        }
        
        function hideTypingIndicator() {
            document.getElementById('typingIndicator').style.display = 'none';
        }
        
        function getAIResponse(userMessage) {
            const responses = [
                "That's an interesting question! Let me help you with that.",
                "I understand what you're asking. Here's what I think...",
                "Great question! Based on what you've told me, I'd suggest...",
                "I'm here to help! Let me provide some insights on that.",
                "Thanks for asking! Here's my perspective on that topic...",
                "I can definitely help you with that. Here's what I recommend...",
                "That's a good point. Let me share some thoughts on that.",
                "I appreciate you bringing that up. Here's what I think..."
            ];
            
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            
            if (!message) return;
            
            // Add user message
            addMessage(message, true);
            input.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            // Simulate AI response
            setTimeout(() => {
                hideTypingIndicator();
                addMessage(getAIResponse(message), false);
            }, 1500 + Math.random() * 1000);
        }
        
        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }
    </script>
</body>
</html>
`;
