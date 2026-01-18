import React from 'react';
import {Nav} from "@/app/page";

async function getMovies (){
    const res = await fetch('https://mock.apidog.com/m1/1172760-1166489-default/api/v1/cinemas/barcelona/movies',
        {cache : "force-cache"});
    if (!res.ok) {
        throw new Error('Error cargando las películas');
    }
    return res.json();
}

async function Page(props) {
    const movies = await getMovies();
    return (
        <div>
            <Nav></Nav>
            <h1>SSG</h1>
            <h2>Static site generation</h2>

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