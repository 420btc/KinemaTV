import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
import { useUser } from "@stackframe/stack";
import CelestialSphere from '../components/ui/celestial-sphere';

export default function Favorites() {
    const stackUser = useUser();
    const { favorites, isLoading, removeFromFavorites } = useFavorites();

    if (!stackUser || !stackUser.id) {
        return (
            <div className="relative min-h-screen">
                <CelestialSphere 
                    hue={340}
                    speed={0.8}
                    zoom={1.1}
                    particleSize={1.3}
                    className="fixed top-0 left-0 w-full h-full z-0"
                />
                <div className="max-w-6xl mx-auto p-4 sm:p-6 text-center relative z-10">
                    <div className="bg-[#101523] rounded-lg p-8">
                        <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Inicia sesión para ver tus favoritos
                        </h2>
                        <p className="text-gray-400">
                            Guarda tus películas favoritas para verlas más tarde
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="relative min-h-screen">
                <CelestialSphere 
                    hue={340}
                    speed={0.8}
                    zoom={1.1}
                    particleSize={1.3}
                    className="fixed top-0 left-0 w-full h-full z-0"
                />
                <div className="flex items-center justify-center min-h-[400px] relative z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="relative min-h-screen">
                <CelestialSphere 
                    hue={340}
                    speed={0.8}
                    zoom={1.1}
                    particleSize={1.3}
                    className="fixed top-0 left-0 w-full h-full z-0"
                />
                <div className="max-w-6xl mx-auto p-4 sm:p-6 text-center relative z-10">
                    <div className="bg-[#101523] rounded-lg p-8">
                        <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">
                            No tienes favoritos aún
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Explora películas y agrega tus favoritas haciendo clic en el corazón
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
                hue={340}
                speed={0.8}
                zoom={1.1}
                particleSize={1.3}
                className="fixed top-0 left-0 w-full h-full z-0"
            />
            <div className="max-w-6xl mx-auto p-4 sm:p-6 relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <Heart className="w-8 h-8 text-red-500" />
                    <h1 className="text-3xl font-bold text-white">Mis Favoritos</h1>
                    <span className="text-gray-400">({favorites.length})</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {favorites.map((favorite) => (
                        <div key={favorite.id} className="group relative">
                            <Link to={`/movie/${favorite.movieId}`}>
                                <div className="relative overflow-hidden rounded-lg bg-[#101523] transition-transform group-hover:scale-105">
                                    <div className="aspect-[2/3]">
                                        {favorite.posterPath ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w500${favorite.posterPath}`}
                                                alt={favorite.title}
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
                                                {favorite.title}
                                            </h3>
                                            {favorite.releaseDate && (
                                                <p className="text-gray-300 text-xs">
                                                    {new Date(favorite.releaseDate).getFullYear()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            
                            <button
                                onClick={() => removeFromFavorites(favorite.movieId)}
                                className="absolute top-2 right-2 p-2 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                                title="Quitar de favoritos"
                            >
                                <Heart className="w-4 h-4 text-red-500 fill-current" />
                            </button>
                            
                            <div className="mt-2">
                                <h3 className="text-white font-medium text-sm truncate">
                                    {favorite.title}
                                </h3>
                                {favorite.releaseDate && (
                                    <p className="text-gray-400 text-xs">
                                        {new Date(favorite.releaseDate).getFullYear()}
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