import movieTrailer from 'movie-trailer';
import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import axios from './axios';
import './Row.css';
const base_url = 'https://image.tmdb.org/t/p/original/';

function Row({ title, fetchUrl, isLargeRow }) {
	const [movies, setMovies] = useState([]);
	const [trailerUrl, setTrailerUrl] = useState('');
	useEffect(() => {
		const fetchData = async () => {
			const request = await axios.get(fetchUrl);
			// console.log(request);
			// console.log(request.data.results);

			setMovies(request.data.results);

			return request;
		};
		fetchData();
	}, [fetchUrl]);
	// console.log(movies);
	// console.table(movies);

	const opts = {
		height: '390',
		width: '100%',
		playerVars: {
			autoplay: 0,
			// https://developers.google.com/youtube/player_parameters
		},
	};
	const handleClick = (movie) => {
		// console.table(movie?.title)
		if (trailerUrl) {
			setTrailerUrl('');
		} else {
			movieTrailer(movie?.title || '')
				.then((url) => {
					const urlParams = new URLSearchParams(new URL(url).search);
					setTrailerUrl(urlParams.get('v'));
				})
				.catch((error) => console.log(error));
		}
	};
	return (
		<div className='row'>
			{/* title */}
			<h2>{title}</h2>

			{/* container -> posters */}

			<div className='row__posters'>
				{/* several row__poster */}

				{movies.map((movie) => (
					<img
						className={`row__poster ${isLargeRow && 'row__posterLarge'}`}
						key={movie.id}
						src={`${base_url}${
							isLargeRow ? movie.poster_path : movie.backdrop_path
						}`}
						alt={movie.title}
						onClick={() => handleClick(movie)}
					/>
				))}
			</div>
			{trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
		</div>
	);
}

export default Row;
