// Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRooms, createRoom, getUsername } from './api';

const Home = ({ username }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await fetchRooms();
        console.log(response)
        setRooms(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  const handleCreateRoom = async () => {
    try {
      const response = await createRoom(username);
      const newRoomCode = response.data.roomCode;
      navigate(`/room/${newRoomCode}`);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  if (loading) return <div>Loading rooms...</div>;

  return (
    <div>
      <h1>Welcome, {username}</h1>
      <h2>Active Rooms</h2>
      <ul>
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <li key={room.room_code}>
              Room Code: {room.roomCode}, Host: {room.host}
            </li>
          ))
        ) : (
          <p>No active rooms available.</p>
        )}
      </ul>
      <button onClick={handleCreateRoom}>Create New Room</button>
    </div>
  );
};

export default Home;
