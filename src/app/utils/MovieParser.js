// utils/moviesParser.js
export const parseMovies = (moviesTxt) => {
    const movies = [];
    const lines = moviesTxt.split('\n');
    let movie = {};
  
    lines.forEach((line) => {
      if (line.startsWith('#EXTINF')) {
        const tvgNameMatch = line.match(/tvg-name="([^"]+)"/);
        const tvgLogoMatch = line.match(/tvg-logo="([^"]+)"/);
  
        if (tvgNameMatch && tvgLogoMatch) {
          movie = {
            title: tvgNameMatch[1],
            image: tvgLogoMatch[1],
          };
        }
      } else if (line.startsWith('http')) {
        movie.url = line.trim();
        movies.push(movie); // Add the movie to the list once we have all info
      }
    });
  
    return movies;
  };
  