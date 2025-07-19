export const ConversationHTML = `
<!DOCTYPE html>
<html lang="en" style="height: 100%">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sendbird AI Agent</title>
    <style>
        body,
        #sendbird-ai-agent-container {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
        }
        #sb-agent-entry {
            display: flex;
            width: 100% !important;
            height: 100% !important;
        }
        .header {
            background: #742DDD;
            color: white;
            padding: 16px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            height: 60px;
            box-sizing: border-box;
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
        .header-title {
            font-size: 18px;
            font-weight: 600;
        }
        .agent-container {
            position: absolute;
            top: 60px;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
        }
        .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <button class="back-button" onclick="goBack()">← Back</button>
        <div class="header-title">AI Agent</div>
        <div></div>
    </div>
    
    <div class="agent-container">
        <div class="loading" id="loadingIndicator">Loading AI Agent...</div>
        <div id="sendbird-ai-agent-container"></div>
    </div>

    <script type="module">
        let messenger = null;

        async function initializeAIAgent() {
            try {
                console.log('Loading Sendbird AI Agent...');
                
                // Import the loadMessenger function from Sendbird CDN
                const { loadMessenger } = await import("https://aiagent.sendbird.com/orgs/default/index.js");
                
                console.log('Creating messenger instance...');
                messenger = await loadMessenger({
                    useShadowDOM: false,
                    customMainComponent: ({ messenger, react }) => {
                        return (props) => {
                            return react.createElement(
                                messenger.AgentProviderContainer,
                                { ...props, fullscreen: true },
                                [
                                    react.createElement(messenger.Conversation)
                                ]
                            );
                        };
                    },
                });

                console.log('Initializing messenger...');
                await messenger.initialize({
                    appId: "10306808-B7F3-436F-9F5C-29F431B47B73",
                    aiAgentId: "1bad24e5-70c7-4ca4-b582-37d1b8f1a664",
                    logLevel: 0,
                    userSessionInfo: {
                        userId: "demo-user-" + Math.random().toString(36).substr(2, 9),
                        sessionHandler: {
                            onSessionTokenRequired(resolve, reject) {
                                // For demo purposes, we'll use anonymous auth
                                resolve(null);
                            },
                        },
                    },
                });

                // Hide loading indicator - customMainComponent renders automatically
                document.getElementById('loadingIndicator').style.display = 'none';
                
                console.log('AI Agent initialized successfully');
                
            } catch (error) {
                console.error('Failed to initialize AI Agent:', error);
                document.getElementById('loadingIndicator').innerHTML = 
                    'Failed to load AI Agent. Please try again.';
            }
        }

        function goBack() {
            // With customMainComponent, no need to explicitly close
            window.ReactNativeWebView.postMessage('goBack');
        }

        // Initialize when page loads
        window.addEventListener('load', initializeAIAgent);
        
        // Cleanup when page unloads
        window.addEventListener('beforeunload', () => {
            if (messenger) {
                try {
                    messenger.destroy();
                } catch (error) {
                    console.error('Error destroying messenger:', error);
                }
            }
        });
    </script>
</body>
</html>
`;
