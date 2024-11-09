import React, { useState } from 'react';
import ChatRoom from './ChatRoom';

const App = () => {
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);

  const handleJoinRoom = () => {
    if (roomCode && username) {
      setJoined(true);
    } else {
      alert('Please enter both username and room code!');
    }
  };

  return (
    <div>
      {joined ? (
        <ChatRoom roomCode={roomCode} username={username} />
      ) : (
        <div>
          <h1>Join Room</h1>
          <input
            type="text"
            placeholder="Enter Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Your Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleJoinRoom}>Join Room</button>
        </div>
      )}
    </div>
  );
};

export default App;
