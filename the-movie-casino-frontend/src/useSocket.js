import { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');  // Connect to the backend server

// Custom hook to listen to Socket.IO events
export const useSocket = (onUserJoined, onMovieTitleSet, onBetFinalized) => {
  useEffect(() => {
    // Listen for user joined event
    socket.on('user_joined', (data) => {
      onUserJoined(data);
    });

    // Listen for movie title set event
    socket.on('movie_title_set', (data) => {
      onMovieTitleSet(data);
    });

    // Listen for bet finalized event
    socket.on('bet_finalized', (data) => {
      onBetFinalized(data);
    });

    // Cleanup on unmount
    return () => {
      socket.off('user_joined');
      socket.off('movie_title_set');
      socket.off('bet_finalized');
    };
  }, [onUserJoined, onMovieTitleSet, onBetFinalized]);
};

