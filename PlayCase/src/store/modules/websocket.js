let socket = null;

export const initWebSocket = (gameId) => {
  socket = new WebSocket(`ws://your-server-url/ws/v1/game/${gameId}/slides`);

  socket.onopen = () => {
    console.log('WebSocket connection established');
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
};

export const sendWebSocketMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.error('WebSocket is not open');
  }
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};