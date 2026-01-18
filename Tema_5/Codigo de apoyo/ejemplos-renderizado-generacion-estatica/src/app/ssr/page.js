import React from 'react';
import {Nav} from "@/app/page";

async function getMovies (){
    const res = await fetch('https://mock.apidog.com/m1/1172760-1166489-default/api/v1/cinemas/madrid/movies',
        {cache : "no-store"});
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
            <h1>SSR</h1>
            <h2>Server Side Rendering</h2>

            <ul>
                {movies.map((movie, index) => (
                    <li key={movie.id + index}>
                        Película {movie.id} - Formato: {movie.format} - Horarios: {movie.showtimes.join(', ')}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Page;