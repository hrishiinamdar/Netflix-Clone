import React, {useState,useEffect} from 'react'
import axios from './axios';
import requests from './requests';
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from 'movie-trailer';

const base_url = "https://image.tmdb.org/t/p/original"; 

function Row({title,fetchURL,isLargeRow}) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, settrailerUrl] = useState("");

    // A snippet of code which basically runs based on a specific condition/variable. 
    useEffect(()=>{
        //if [], run once when the row loads, and do not run again. 
        async function fetchData(){
            const request= await axios.get(fetchURL);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    },[fetchURL]);  //we are giving the dependency over here because we are passing fetchURL from outside the block
    //console.table(movies);
    const opts = {
        height: "390",
        width: "100%",
        playerVars:{
            //https://developers.google.com/youtube/player_parameters
            autoplay:1,
        },
    };

    const handleClick = (movie) => {
        if(trailerUrl){
            settrailerUrl('');
        }
        else{
            movieTrailer(movie?.name||"")
            .then((url) => {
                const urlParams = new URLSearchParams(new URL(url).search);
                settrailerUrl( urlParams.get("v"));
            }).catch(error => console.log(error))
        }
    }

    return (
        <div className="row">
            <h2>{title}</h2> 
            {/* title*/}
            <div className="row_posters">
                {/* container -> posters*/}
                {movies.map(movie =>(
                    <img 
                    key={movie.id}
                    onClick={() => handleClick(movie)}
                    className={`row_poster ${isLargeRow && "row_posterLarge" }`}
                    src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} alt={movie.name}/>
                ))}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts}/>}

        </div>
    )
}

export default Row
