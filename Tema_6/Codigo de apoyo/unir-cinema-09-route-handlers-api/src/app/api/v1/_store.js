// Almacenamiento temporal en memoria usando Map
// En el futuro se reemplazará por una base de datos

const store = new Map();

// Datos iniciales de películas (detalle completo)
const movies = [
  {
    id: 1,
    title: "El retorno del animal",
    genre: "Ciencia Ficción",
    duration: "169 min",
    rating: "4.9/10",
    synopsis: "Una épica aventura que desafía los límites de la imaginación, donde el protagonista debe enfrentarse a su pasado para salvar el futuro de la humanidad.",
    image: "/film-poster.jpg",
    poster: "/film-poster.jpg",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"],
    year: 2014
  },
  {
    id: 2,
    title: "Being chulo",
    genre: "Drama",
    duration: "175 min",
    rating: "4.8/10",
    synopsis: "La historia de una familia poderosa que controla un imperio, explorando temas de lealtad, traición y el precio del poder.",
    image: "/film-poster.jpg",
    poster: "/film-poster.jpg",
    director: "Francis Ford Coppola",
    cast: ["Marlon Brando", "Al Pacino", "James Caan"],
    year: 1972
  },
  {
    id: 3,
    title: "Conociendo a Omar",
    genre: "Crimen",
    duration: "154 min",
    rating: "4.7/10",
    synopsis: "Varias historias entrelazadas de crimen y redención en Los Ángeles, contadas de manera no lineal con diálogos memorables.",
    image: "/film-poster.jpg",
    poster: "/film-poster.jpg",
    director: "Quentin Tarantino",
    cast: ["John Travolta", "Samuel L. Jackson", "Uma Thurman"],
    year: 1994
  },
  {
    id: 4,
    title: "Avatar: El camino del agua",
    genre: "Ciencia ficción",
    duration: "192 min",
    rating: "7.8/10",
    synopsis: "Jake Sully vive con su nueva familia formada en el planeta de Pandora. Una vez que una amenaza familiar regresa para terminar lo que se empezó anteriormente, Jake debe trabajar con Neytiri y el ejército de la raza Na'vi para proteger su planeta.",
    image: "/film-poster.jpg",
    poster: "/film-poster.jpg",
    director: "James Cameron",
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
    year: 2022
  }
];

// Lista de cines disponibles
const cinemas = ["Madrid", "Barcelona", "Sevilla", "Valencia"];

// Películas por cine (sesiones)
const cinemaMovies = {
  Madrid: [
    { id: 1, showtimes: ["16:00", "19:30", "22:45"], format: "3d" },
    { id: 2, showtimes: ["15:30", "18:15", "21:00"], format: "imax" },
    { id: 3, showtimes: ["17:00", "20:00", "23:00"], format: "hdfr" }
  ],
  Barcelona: [
    { id: 1, showtimes: ["15:00", "18:30", "21:45"], format: "imax" },
    { id: 2, showtimes: ["16:30", "19:15", "22:00"], format: "3d" },
    { id: 4, showtimes: ["14:00", "17:00", "20:00"], format: "hdfr" }
  ],
  Sevilla: [
    { id: 2, showtimes: ["16:00", "19:00", "22:00"], format: "3d" },
    { id: 3, showtimes: ["15:30", "18:30", "21:30"], format: "imax" },
    { id: 4, showtimes: ["17:30", "20:30", "23:30"], format: "hdfr" }
  ],
  Valencia: [
    { id: 1, showtimes: ["14:30", "17:30", "20:30"], format: "hdfr" },
    { id: 3, showtimes: ["16:00", "19:00", "22:00"], format: "3d" },
    { id: 4, showtimes: ["15:00", "18:00", "21:00"], format: "imax" }
  ]
};

// Métricas del sistema
const metrics = {
  ticketsSoldToday: 150000,
  ticketsSoldMonth: 38542,
  minutesWatchedYear: 125400000,
  averageRating: 4.3,
  activeScreenings: 24,
  totalCustomers: 892341,
  updatedAt: new Date().toISOString()
};

// Inicializar el store
store.set("movies", movies);
store.set("cinemas", cinemas);
store.set("cinemaMovies", cinemaMovies);
store.set("metrics", metrics);

export default store;
