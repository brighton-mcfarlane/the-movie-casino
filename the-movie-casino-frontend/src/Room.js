// Room.js
import React from 'react';
import { useParams } from 'react-router-dom';

const Room = () => {
  const { roomCode } = useParams();

  return (
    <div>
      <h1>Room {roomCode}</h1>
      {/* Add room functionality here */}
    </div>
  );
};

export default Room;
