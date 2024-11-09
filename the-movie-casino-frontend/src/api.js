import axios from 'axios';

// Set the backend API URL
const API_URL = 'http://127.0.0.1:5000';

// Function to create a new room
export const createRoom = async (host) => {
  try {
    const response = await axios.post(`${API_URL}/create-room`, { host });
    return response.data; // returns { room_code, host }
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

// Function to join an existing room
export const joinRoom = async (roomCode, user) => {
  try {
    const response = await axios.post(`${API_URL}/join-room`, { room_code: roomCode, user });
    return response.data; // returns { room_code, members }
  } catch (error) {
    console.error('Error joining room:', error);
    throw error;
  }
};

// Function to set the movie title
export const setMovieTitle = async (roomCode, movieTitle, host) => {
  try {
    const response = await axios.post(`${API_URL}/set-movie-title`, { room_code: roomCode, movie_title: movieTitle, host });
    return response.data; // returns { movie_title }
  } catch (error) {
    console.error('Error setting movie title:', error);
    throw error;
  }
};

// Function to place a bet
export const placeBet = async (roomCode, user, betAmount) => {
  try {
    const response = await axios.post(`${API_URL}/place-bet`, { room_code: roomCode, user, bet_amount: betAmount });
    return response.data; // returns { bet_id, remaining_chips }
  } catch (error) {
    console.error('Error placing bet:', error);
    throw error;
  }
};

// Function to approve a bet
export const approveBet = async (roomCode, betId, user, approval) => {
  try {
    const response = await axios.post(`${API_URL}/approve-bet`, { room_code: roomCode, bet_id: betId, user, approval });
    return response.data; // returns { bet_id, status }
  } catch (error) {
    console.error('Error approving bet:', error);
    throw error;
  }
};

// Function to get the list of active rooms with retry logic
export const fetchRooms = async (retries = 5, delay = 2000) => {
  let attempt = 0;
  
  const tryFetch = async () => {
    attempt++;
    try {
      const response = await axios.get(`${API_URL}/rooms`);
      return response.data.rooms; // returns [{ room_code, host }, ...]
    } catch (error) {
      if (attempt < retries) {
        console.log(`Retrying fetch rooms... Attempt ${attempt}`);
        await new Promise(res => setTimeout(res, delay)); // wait before retry
        return tryFetch(); // retry the request
      } else {
        throw new Error('Failed to fetch rooms after multiple attempts');
      }
    }
  };

  return tryFetch();
};

// Function to set the username
export const setUsername = (username) => {
  localStorage.setItem('username', username);
};

// Function to get the username
export const getUsername = () => {
  return localStorage.getItem('username');
};
