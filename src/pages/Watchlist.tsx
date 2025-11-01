import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { useWatchlist } from "../hooks/useWatchlist";
import { useUser } from "@stackframe/stack";
import CelestialSphere from '../components/ui/celestial-sphere';

export default function Watchlist() {
    const stackUser = useUser();
    const { watchlist, isLoading, removeFromWatchlist } = useWatchlist();

    if (!stackUser || !stackUser.id) {
        return (
            <div className="max-w-6xl mx-auto p-4 sm:p-6 text-center relative">
                <CelestialSphere 
                    hue={240}
                    speed={0.7}
                    zoom={1.0}
                    particleSize={1.2}
                />
                <div className="bg-[#101523] rounded-lg p-8 relative z-10">
                    <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Inicia sesión para ver tu lista
                    </h2>
                    <p className="text-gray-400">
                        Guarda películas para ver más tarde
                    </p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="relative min-h-screen">
                <CelestialSphere 
                    hue={240}
                    speed={0.7}
                    zoom={1.0}
                    particleSize={1.2}
                    className="fixed top-0 left-0 w-full h-full z-0"
                />
                <div className="flex items-center justify-center min-h-[400px] relative z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (watchlist.length === 0) {
        return (
            <div className="relative min-h-screen">
                <CelestialSphere 
                    hue={240}
                    speed={0.7}
                    zoom={1.0}
                    particleSize={1.2}
                    className="fixed top-0 left-0 w-full h-full z-0"
                />
                <div className="max-w-6xl mx-auto p-4 sm:p-6 text-center relative z-10">
                    <div className="bg-[#101523] rounded-lg p-8">
                        <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Tu lista está vacía
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Explora películas y agrega las que quieras ver más tarde
                        </p>
                        <Link
                            to="/explore"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Explorar Películas
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            <CelestialSphere 
                hue={240}
                speed={0.7}
                zoom={1.0}
                particleSize={1.2}
                className="fixed top-0 left-0 w-full h-full z-0"
            />
            <div className="max-w-6xl mx-auto p-4 sm:p-6 relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <Bookmark className="w-8 h-8 text-blue-500" />
                    <h1 className="text-3xl font-bold text-white">Mi Lista</h1>
                    <span className="text-gray-400">({watchlist.length})</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {watchlist.map((item) => (
                        <div key={item.id} className="group relative">
                            <Link to={`/movie/${item.movieId}`}>
                                <div className="relative overflow-hidden rounded-lg bg-[#101523] transition-transform group-hover:scale-105">
                                    <div className="aspect-[2/3]">
                                        {item.posterPath ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                                <span className="text-gray-400 text-sm text-center p-2">
                                                    Sin imagen
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                                            <h3 className="text-white font-semibold text-sm mb-2 px-2">
                                                {item.title}
                                            </h3>
                                            {item.releaseDate && (
                                                <p className="text-gray-300 text-xs">
                                                    {new Date(item.releaseDate).getFullYear()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            
                            <button
                                onClick={() => removeFromWatchlist(item.movieId)}
                                className="absolute top-2 right-2 p-2 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                                title="Quitar de la lista"
                            >
                                <Bookmark className="w-4 h-4 text-blue-500 fill-current" />
                            </button>
                            
                            <div className="mt-2">
                                <h3 className="text-white font-medium text-sm truncate">
                                    {item.title}
                                </h3>
                                {item.releaseDate && (
                                    <p className="text-gray-400 text-xs">
                                        {new Date(item.releaseDate).getFullYear()}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}