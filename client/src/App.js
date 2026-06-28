import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Watchlist from './pages/Watchlist';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

const App = () => (
  <div className="flex min-h-screen flex-col bg-slate-950">
    <Navbar />

    <main className="flex-1">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>

    <footer className="border-t border-slate-800 bg-slate-950 py-6">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-500 sm:px-6">
        CineVault · Movie data from{' '}
        <a
          href="https://www.themoviedb.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-400 hover:text-brand-300"
        >
          TMDB
        </a>{' '}
        · Built with the MERN stack
      </div>
    </footer>
  </div>
);

export default App;
