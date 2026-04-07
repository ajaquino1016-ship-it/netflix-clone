import React, { useState, useEffect, useRef } from "react"; // Added useRef
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/";

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");


    const rowRef = useRef(null);
    const [isScrolling, setIsScrolling] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const onMouseDown = (e) => {
        setIsScrolling(true);

        setStartX(e.pageX - rowRef.current.offsetLeft);
        setScrollLeft(rowRef.current.scrollLeft);
    };

    const stopScrolling = () => {
        setIsScrolling(false);
    };

    const onMouseMove = (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        const x = e.pageX - rowRef.current.offsetLeft;
        const walk = (x - startX) * 0.7;
        rowRef.current.scrollLeft = scrollLeft - walk;
    };

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        },
    };

    const handleclick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl("");
        } else {
            movieTrailer(movie?.name || movie?.title || movie?.original_name || "")
                .then((url) => {
                    const urlParams = new URLSearchParams(new URL(url).search);
                    setTrailerUrl(urlParams.get("v"));
                })
                .catch((error) => console.log("Trailer Error:", error));
        }
    };

    return (
        <div className="row">
            <h2>{title}</h2>
            <div
                className="row__posters"
                ref={rowRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={stopScrolling}
                onMouseLeave={stopScrolling}
                style={{
                    cursor: isScrolling ? "grabbing" : "grab"
                }}
            >
                {movies && movies.map((movie) => (
                    <img
                        key={movie.id}
                        onClick={() => handleclick(movie)}
                        className={`row__poster ${isLargeRow ? "row__posterLarge" : ""}`}
                        src={
                            isLargeRow
                                ? movie.poster_path
                                    ? `${base_url}w500${movie.poster_path}`
                                    : "/no-image.png"
                                : movie.backdrop_path
                                    ? `${base_url}w780${movie.backdrop_path}`
                                    : "/no-image.png"
                        }
                        alt={movie.name || movie.title}
                        loading="lazy"
                        draggable="false"
                    />
                ))}
            </div>

            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    );
}

export default Row;