import api from './axios';

export const getWatchlist = async () => {
  const { data } = await api.get('/watchlist');
  return data.data.items;
};

export const addToWatchlist = async (movie) => {
  const { data } = await api.post('/watchlist', movie);
  return data.data.items;
};

export const removeFromWatchlist = async (movieId) => {
  const { data } = await api.delete(`/watchlist/${movieId}`);
  return data.data.items;
};
