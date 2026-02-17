import MovieCard from "./MovieCard";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Login-SignIn/UserContext";
export default function MainMovieDiv() {
    
    

    const [movies, setMovies] = useState([]);
    useEffect(() => {
        const fetmovie = async () => {
            await fetch("https://cinesync-3k1z.onrender.com/getAllMovies")
                .then((res) => {
                    return res.json();
                }).then((data) => {
                    console.log(data.movies);
                    setMovies(data.movies);
                }).catch((err) => {
                    console.log(err);
                })
        }
        fetmovie();
    }, [])
    let categoryNameArray = [];

    let categorizedArray = [];



    if (movies) {
        (movies.map(movie => {
            categorizedArray.push([]);
            if (!categoryNameArray.includes(movie.Category_Name)) {
                categoryNameArray.push(movie.Category_Name);
            }
    
    
        }));
        movies.map((movie) => {

            categoryNameArray.map((cat) => {

                if (movie.Category_Name == cat) {

                    categorizedArray[categoryNameArray.indexOf(cat)].push(movie);
                }
            })
        })
    }
    // console.log(categorizedArray);


    let category = "";



    return (
        <>
            {
                categorizedArray.map((movie, index) => {
                    return(
                      (movie.length>0?(
                        <div id="catMovie" key={index}>
                        <h1 class="movieCat">{movie[0].Category_Name}</h1>
                        <div id="movieitems">
                            {movie.map((singleMovie,index) => {
                              return(
                                
                                <MovieCard url={'https://res.cloudinary.com/dsike2jgr/video/upload/v1771335888/Asuran_dosyjf.mp4'} key={index} title={singleMovie.title} image={movie} genre={singleMovie.Category_Name} year={singleMovie.year}></MovieCard>
                                
                                )
                            })}

                        </div>
                    </div>
                      ):"")
                    )
                })
            }
        </>
    )
}
