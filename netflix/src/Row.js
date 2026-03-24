import React, { useState, useEffect } from "react";
import axios from "./axios";

// 1. Idagdag ito para gumana ang mga images
const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl }) { 
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);

    return (
        <div className="row">
            <h2>{title}</h2>
            <div className="row__posters">
                {movies && movies.map((movie) => (
                    <img
                        key={movie.id}
                        className="row__poster"
                        // 2. Dito ginagamit ang base_url na ni-define natin sa taas
                        src={`${base_url}${movie.poster_path}`}
                        alt={movie.name}
                    />
                ))}
            </div>
        </div>
    );
}

export default Row;