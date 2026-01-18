"use client";

import React, {useEffect, useState} from 'react';
import {Nav} from "@/app/page";


async function getMovies (){
    const res = await fetch('https://mock.apidog.com/m1/1172760-1166489-default/api/v1/cinemas/valencia/movies',
        {cache : "no-store"});
    if (!res.ok) {
        throw new Error('Error cargando las películas');
    }
    return res.json();
}

function Page(props) {

    const [movies, setMovies] = useState([]);

    useEffect(() => {
        getMovies().then(data => setMovies(data));
    }, []);

    return (
        <div>
            <Nav></Nav>
            <h1>CSR</h1>
            <h2>Client side rendering</h2>

            <ul>
                {movies.map((movie) => (
                    <li key={movie.id}>
                        Película {movie.id} - Formato: {movie.format} - Horarios: {movie.showtimes.join(', ')}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Page;