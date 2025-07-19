export const ConversationHTML = `
<!DOCTYPE html>
<html lang="en" style="height: 100%">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Agent Messages</title>
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
      width: 100vw;
    }
    
    #sendbird-ai-agent-container {
      width: 100%;
      height: 100%;
    }
    
    #sb-agent-entry {
      display: flex;
      width: 100% !important;
      height: 100% !important;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    
    .loading-text {
      color: #666;
      font-size: 16px;
    }
    
    .error-container {
      display: none;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
      flex-direction: column;
      gap: 16px;
    }
    
    .error-text {
      color: #d32f2f;
      font-size: 16px;
      text-align: center;
      max-width: 300px;
    }
    
    .retry-button {
      background: #742DDD;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
    }
    
    .retry-button:hover {
      background: #632BB5;
    }
  </style>
</head>
<body>
  <div class="loading-container" id="loadingContainer">
    <div class="loading-text">Loading AI Agent...</div>
  </div>
  
  <div class="error-container" id="errorContainer">
    <div class="error-text" id="errorText">Failed to load AI Agent</div>
    <button class="retry-button" onclick="initializeAgent()">Retry</button>
  </div>

  <script type="module">
    let messenger = null;
    let isSDKLoaded = false;

    function sendMessageToRN(type, payload = {}) {
      const message = {
        type,
        payload: {
          ...payload,
          timestamp: Date.now()
        }
      };
      
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(message));
      }
    }

    async function loadSDK(params) {
      try {
        const { loadMessenger } = await import("https://aiagent.sendbird.com/orgs/default/index.js");
        messenger = await loadMessenger({
          useShadowDOM: false,
          customMainComponent: ({ messenger, react }) => {
            return (props) => {
              const [channelUrl, setChannelUrl] = react.useState('');
              
              react.useEffect(() => {
                setTimeout(() => {
                  setChannelUrl(params.channelUrl);
                }, 1000);
              }, [params.status, params.channelUrl]);
              
              return react.createElement(
                messenger.AgentProviderContainer,
                props,
                [
                  !channelUrl ? null : react.createElement(messenger.Conversation, {
                    closedChannelUrl: channelUrl,
                    onClearClosedChannelUrl: () => {
                      sendMessageToRN('CLOSE_CONVERSATION');
                    },
                  },
                  [
                    react.createElement(messenger.ConversationLayout.Header, {
                      component: () => null,
                    }),
                  ])
                ]
              );
            };
          },
        });
        
        isSDKLoaded = true;
        sendMessageToRN('SDK_LOADED');
      } catch (error) {
        showError('Failed to load AI Agent SDK');
        sendMessageToRN('SDK_ERROR', { error: error.message });
      }
    }
    
    const sessionHandlerDeferred = {
      promise: null,
      resolve: null,
      reject: null
    };

    async function initializeSDK(params) {
      try {
        if (!messenger) {
          throw new Error('SDK not loaded');
        }
        
        const userSessionInfo = params.userSessionInfo ? {
          userId: params.userSessionInfo.userId,
          authToken: params.userSessionInfo.authToken,
          sessionHandler: {
            onSessionTokenRequired: (resolve, reject) => {
              sessionHandlerDeferred.promise = new Promise((tokenResolve, tokenReject) => {
                sessionHandlerDeferred.resolve = tokenResolve;
                sessionHandlerDeferred.reject = tokenReject;
              });
              
              sendMessageToRN('TOKEN_REFRESH_REQUIRED');
            }
          }
        } : undefined;
        
        messenger.initialize({
          ...params,
          userSessionInfo,
        });
        
        hideLoading();
        sendMessageToRN('SDK_INITIALIZED', { success: true });
      } catch (error) {
        showError('Failed to initialize AI Agent');
        sendMessageToRN('SDK_ERROR', { error: error.message });
      }
    }

    async function handleCommand(commandStr) {
      try {
        const command = JSON.parse(commandStr);
        
        switch (command.type) {
          case 'START_CONVERSATION':
            await loadSDK(command.payload.loadParams);
            initializeSDK(command.payload.initParams);
            break;
          case 'TOKEN_REFRESHED':
            if (sessionHandlerDeferred.promise) {
              sessionHandlerDeferred.resolve(command.payload.authToken);
              sessionHandlerDeferred.promise = null;
              sessionHandlerDeferred.resolve = null;
              sessionHandlerDeferred.reject = null;
            }
            break;
          default:
        }
      } catch (error) {
      }
    }

    function showLoading() {
      document.getElementById('loadingContainer').style.display = 'flex';
      document.getElementById('errorContainer').style.display = 'none';
    }

    function hideLoading() {
      document.getElementById('loadingContainer').style.display = 'none';
    }

    function showError(message) {
      document.getElementById('loadingContainer').style.display = 'none';
      document.getElementById('errorContainer').style.display = 'flex';
      document.getElementById('errorText').textContent = message;
    }

    function initializeAgent() {
      showLoading();
      if (!isSDKLoaded) {
        sendMessageToRN('WEBVIEW_LOADED');
      } 
    }

    window.handleCommand = handleCommand;
    window.initializeAgent = initializeAgent;
    window.addEventListener('load', () => {
      initializeAgent();
    });
  </script>
</body>
</html>
`;
