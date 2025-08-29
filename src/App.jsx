import Search from './components/Search.jsx';
import {useDebounce} from 'react-use';
import React, { useEffect, useState } from 'react';
import react from 'react';
import MovieCard from './components/MovieCard.jsx';
import Spinner from './components/Spinner.jsx';

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

// VITE_APPWRITE_PROJECT_ID = "68ae716600131da5916a"
// VITE_APPWRITE_PROJECT_NAME = "jsm_movie_app"
// VITE_APPWRITE_ENDPOINT = "https://syd.cloud.appwrite.io/v1"
        

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const[errorMessage, setErrorMessage] = useState('');
  const[movieList, setMovieList] = useState([]);
  const[isLoading, setIsLoading] = useState(false);
  const[debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try{
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`:`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

     if(!response.ok){
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      if(data.response === 'False'){
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
    }catch(error){
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    } finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(searchTerm);
  }, [searchTerm])

  return (
    <main>

      <div className="pattern"/>
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll enjoy without hassle</h1>
           <Search searchTerm = {searchTerm} setSearchTerm = {setSearchTerm} />
        </header>

       <section className= "all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
          {isLoading ? (
           <Spinner />
          ) : errorMessage ? (
            <p className = "text-red-500">{errorMessage}</p>
          ): (
             <ul>
               {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
               ))}
             </ul>
          )}
        </section>
        
      </div>
    
    </main>
  );
}

export default App
