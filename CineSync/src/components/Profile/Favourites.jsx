import MovieCard from "./MovieCard";
 
const movies = [
{ title: "Soorarai Pootru", year: 1994, genre: "Drama", progress: 100,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRipbGJfS25vs4TNyET6Yza93CjpM-2syvNw&s" },
{ title: "Lubber Pandhu", year: 2014, genre: "Sci-Fi", progress: 65,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKd6fi0ttc7uvmFFDFc4V7TMxXYkuPAProFQ&s" },
{ title: "Hero", year: 2008, genre: "Action", progress: 80,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwQQjDOlcAJS22i_YPZyIBm1dnIC2jAM_e9g&s" },
{ title: "Petta", year: 2010, genre: "Thriller", progress: 90 ,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9pMYcA7EuJJTsXa3AuUe_xwv6jPCqZ7RV-Q&s"},
{ title: "Raayan", year: 2019, genre: "Thriller", progress: 70 ,image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeFJM5FNy8VoF6SscF0TV1esIbJ86BWqOGFg&s"},
];
 
function Favourites(){
    return <>
        <div className="favouritesection">
            <div className="recent-head">
                <div className="point-mark"></div>
                <h2 style={{ marginBottom: "1rem" }}>Favourites</h2>
            </div>
            <div className="favourite">
                {movies.map((movie) => (
                    <MovieCard key={movie.title} movie={movie} />
                ))}
            </div>
        </div>
        </>
    }
 
export default Favourites; 