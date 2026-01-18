import React from 'react';
import {Nav} from "@/app/page";
import RefreshOnFocus from './RefreshOnFocus';

export const revalidate = 20; // Revalidar cada 20 segundos

async function getMovies() {
    const res = await fetch('https://mock.apidog.com/m1/1172760-1166489-default/api/v1/cinemas/sevilla/movies');
    if (!res.ok) {
        throw new Error('Error cargando las películas');
    }
    const movies = await res.json();
    console.log("Pagina generada con los datos siguientes:", movies);
    return movies;
}

async function Page(props) {
    const movies = await getMovies();
    return (
        <div>
            <RefreshOnFocus />
            <Nav></Nav>
            <h1>ISR</h1>
            <h2>Incremental static generation</h2>

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