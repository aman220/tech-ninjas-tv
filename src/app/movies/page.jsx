"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import NavBar from "../NavBar";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const parseMovies = (moviesTxt) => {
  const movies = [];
  const lines = moviesTxt.split("\n");
  let movie = {};

  lines.forEach((line) => {
    if (line.startsWith("#EXTINF")) {
      const tvgNameMatch = line.match(/tvg-name="([^"]+)"/);
      const tvgLogoMatch = line.match(/tvg-logo="([^"]+)"/);

      if (tvgNameMatch && tvgLogoMatch) {
        movie = {
          title: tvgNameMatch[1],
          image: tvgLogoMatch[1],
        };
      }
    } else if (line.startsWith("http")) {
      movie.url = line.trim();
      movies.push(movie);
    }
  });

  return movies;
};

const handleMovieClick = (movieUrl) => {
  window.open(movieUrl, "_blank");
};

function MovieSection({ title, movies }) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        <ChevronRight className="w-6 h-6 text-pink-500" />
      </div>
      <div className="flex flex-wrap gap-4">
        {movies.map((movie, index) => (
          <div
            key={index}
            className="w-48 flex-shrink-0 cursor-pointer"
            onClick={() => handleMovieClick(movie.url)}
          >
            <Image
              src={movie.image}
              alt={movie.title}
              width={200}
              height={300}
              className="rounded-lg shadow-md mb-2"
            />
            <h3 className="font-semibold text-sm mb-1 truncate">
              {movie.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}

const Page = () => {
  const [isClient, setIsClient] = useState(false);
  const [moviesOnRent, setMoviesOnRent] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    fetch("https://tech-ninjas-tv.vercel.app/movies.txt")
      .then((res) => res.text())
      .then((data) => {
        const parsedMovies = parseMovies(data);
        setMoviesOnRent(parsedMovies.slice(0, 50000));
        setFilteredMovies(parsedMovies.slice(0, 50000));
        setIsLoading(false);  // Set loading to false after fetching
      });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const searchResults = moviesOnRent.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(searchResults.slice(0, 50000));
    } else {
      setFilteredMovies(moviesOnRent.slice(0, 50000));
    }
  }, [searchQuery, moviesOnRent]);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8 overflow-hidden">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a movie..."
          className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
        />
        {isLoading ? (
          <div className="flex justify-center items-center">
            <p>Loading movies, please wait...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-bold text-base">Total Count : 20k</h2>
              <h2 className="text-bold text-base my-4">(Movies may not work if you use GLA internet. Use your own internet or using VPN for better experience)</h2>
            </div>
            <MovieSection title="Movies for You" movies={filteredMovies} />
          </>
        )}
      </div>
    </>
  );
};

export default Page;
