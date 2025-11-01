import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Explore from "./pages/Explore";
import MovieDetail from "./pages/MovieDetail";
import TVDetail from "./pages/TVDetail";
import Favorites from "./pages/Favorites";
import Watchlist from "./pages/Watchlist";
import TierList from "./pages/TierList";
import SignIn from "./pages/SignIn";
import SignOut from "./pages/SignOut";
import OAuthCallback from "./pages/OAuthCallback";
import { DecadeChallenge } from "./components/DecadeChallenge";
import { SeasonChallenge } from "./components/SeasonChallenge";
import { AuthButton } from "./components/AuthButton";
import { ChatPopup } from "./components/ChatPopup";
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Toaster } from "react-hot-toast";



function App() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // 🔒 Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
      setQuery("");
      setIsOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0E1A] text-slate-100 font-sans">
      {/* ✅ Navbar */}
      <nav className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl sm:text-2xl font-extrabold tracking-wide flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 hover:scale-105 transition-transform drop-shadow-lg whitespace-nowrap mr-12"
          >
            🎬 KinemaTV
          </Link>

          {/* Desktop menu */}
          <div className="hidden sm:flex items-center gap-6 flex-1">
            <Link to="/" className="hover:text-orange-400 transition">Inicio</Link>
            <Link to="/explore" className="hover:text-orange-400 transition">Explorar</Link>
            <Link to="/search" className="hover:text-orange-400 transition">Buscar</Link>
            <Link to="/tierlist" className="hover:text-orange-400 transition whitespace-nowrap">Tier List</Link>
            <Link to="/decade-challenge" className="hover:text-orange-400 transition">Décadas</Link>
            <Link to="/season-challenge" className="hover:text-orange-400 transition">Temporadas</Link>
            <Link to="/favorites" className="hover:text-orange-400 transition">Favoritos</Link>
            <Link to="/watchlist" className="hover:text-orange-400 transition">Watchlist</Link>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-white/10 backdrop-blur-md rounded-lg overflow-hidden shadow-inner border border-white/20"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar película o serie..."
                className="px-3 py-1 bg-transparent text-sm text-white focus:outline-none"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-orange-400 to-yellow-400 text-black px-4 py-1 text-sm font-semibold transition hover:opacity-90"
              >
                🔍
              </button>
            </form>

            {/* Auth Button */}
            <AuthButton />
          </div>

          {/* Hamburguesa */}
          <button
            className="sm:hidden flex flex-col gap-1.5 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Abrir menú"
          >
            <span
              className={`h-0.5 w-6 bg-gradient-to-r from-orange-400 to-yellow-400 transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`h-0.5 w-6 bg-gradient-to-r from-orange-400 to-yellow-400 transition-opacity duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`h-0.5 w-6 bg-gradient-to-r from-orange-400 to-yellow-400 transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="sm:hidden bg-white/5 backdrop-blur-xl border-t border-white/10 flex flex-col items-center py-6 gap-6 animate-slideDown">
            <Link to="/" className="hover:text-orange-400 transition" onClick={() => setIsOpen(false)}>Inicio</Link>
            <Link to="/explore" className="hover:text-orange-400 transition" onClick={() => setIsOpen(false)}>Explorar</Link>
            <Link to="/search" className="hover:text-orange-400 transition" onClick={() => setIsOpen(false)}>Buscar</Link>
            <Link to="/tierlist" className="hover:text-orange-400 transition whitespace-nowrap" onClick={() => setIsOpen(false)}>Tier List</Link>
            <Link to="/decade-challenge" className="hover:text-orange-400 transition" onClick={() => setIsOpen(false)}>Décadas</Link>
            <Link to="/season-challenge" className="hover:text-orange-400 transition" onClick={() => setIsOpen(false)}>Temporadas</Link>

            {/* Buscador mobile */}
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-white/10 backdrop-blur-md rounded-lg overflow-hidden shadow-inner border border-white/20 w-11/12 max-w-sm"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar..."
                className="px-3 py-2 bg-transparent text-sm text-white focus:outline-none flex-1"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-orange-400 to-yellow-400 text-black px-4 py-2 text-sm font-semibold transition hover:opacity-90"
              >
                🔍
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* ✅ Contenido */}
      <main className="flex-1 w-full md:max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/search" element={<Search />} />
          <Route path="/tierlist" element={<TierList />} />
          <Route path="/decade-challenge" element={<DecadeChallenge />} />
          <Route path="/season-challenge" element={<SeasonChallenge />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/tv/:id" element={<TVDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signout" element={<SignOut />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
        </Routes>
      </main>

      {/* ✅ Footer */}
      <footer className="text-center text-xs sm:text-sm text-gray-400 py-6 border-t border-[#1E2533] bg-[#0A0E1A]">
        <p>
         {" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:underline"
          >
            
          </a>
           
        </p>

        <p className="mt-3">
          {" "}
          <a
            href="https://juancatena.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent font-semibold hover:opacity-90 transition"
          >
            
          </a>{" "}
         <span className="text-gray-500">KinemaTV © 2025</span>
        </p>
      </footer>

      {/* Toaster */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: "#1A2233", color: "#fff" },
          success: { iconTheme: { primary: "#FACC15", secondary: "#1A2233" } },
        }}
      />

      {/* Chat Popup */}
      <ChatPopup />
    </div>
  );
}

export default App;
