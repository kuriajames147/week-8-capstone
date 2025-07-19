import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const useSocket = (eventHandlers) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to Socket.io server
    socketRef.current = io(process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000');

    // Set up event listeners
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socketRef.current.on(event, handler);
    });

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [eventHandlers]);

  const emit = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  return { emit, socket: socketRef.current };
};

export default useSocket;