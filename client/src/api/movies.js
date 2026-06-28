import api from './axios';

export const fetchMovies = async (category, page = 1) => {
  const { data } = await api.get(`/movies/category/${category}`, { params: { page } });
  return data.data; // { page, totalPages, totalResults, results }
};

export const searchMovies = async (query, page = 1) => {
  const { data } = await api.get('/movies/search', { params: { q: query, page } });
  return data.data;
};

export const fetchMovieById = async (id) => {
  const { data } = await api.get(`/movies/${id}`);
  return data.data;
};
