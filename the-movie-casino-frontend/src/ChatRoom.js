import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// Create socket connection
const socket = io('http://localhost:5000');

const ChatRoom = ({ roomCode, username }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // Listen for new messages from the server
  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on('load_messages', (roomMessages) => {
      setMessages(roomMessages);
    });

    // Join the room when the component mounts
    socket.emit('join_room', { roomCode, user: username });
    setIsConnected(true);

    return () => {
      socket.off('receive_message');
      socket.off('load_messages');
    };
  }, [roomCode, username]);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit('send_message', { roomCode, user: username, message });
      setMessage('');
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-room">
      <h2>Chat Room: {roomCode}</h2>
      <div className="messages-container">
        {messages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          <div>
            {messages.map((msg, index) => (
              <div key={index} className="message">
                <strong>{msg.user}: </strong>
                <span>{msg.message}</span>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
