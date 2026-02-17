import MovieCard from "./MovieCard";
 
const movies = [
{ title: "Komali", year: 1994, genre: "Drama", progress: 100, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwQQjDOlcAJS22i_YPZyIBm1dnIC2jAM_e9g&s" },
{ title: "Jailer", year: 2014, genre: "Sci-Fi", progress: 65, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKd6fi0ttc7uvmFFDFc4V7TMxXYkuPAProFQ&s" },
{ title: "Teddy", year: 2008, genre: "Action", progress: 80, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSI4opX3sF0g9A18uZdWimoMRrJkfE0p7l6g&s" },
{ title: "Vikram", year: 2010, genre: "Thriller", progress: 90, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRipbGJfS25vs4TNyET6Yza93CjpM-2syvNw&s" },
{ title: "Madarasi", year: 2019, genre: "Thriller", progress: 70, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaM73B9MNiHowW7O0JjOh-Y1RqmRwX5VH2tw&s" },
];
 
export default function RecentlyWatched() {
    return (
        <section className="recent">
            <div className="recent-head">
                <div className="point-mark"></div>
                <h2 >Recently Watched</h2>
            </div>
            <div className="movie-list">
                {movies.map((movie) => (
                    <MovieCard key={movie.title} movie={movie} />
                ))}
            </div>
        </section>
    );
} 