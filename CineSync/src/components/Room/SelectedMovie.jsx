export default function SelectedMovie({movie,confirmDiv}){
    if(movie.url==undefined){
        return(
            <>
                <div className="empty flex">
                    <div className="movieIcon flex">
                        <i class="fa-solid fa-clapperboard"></i>
                    </div>
                    <h1>Select a Movie</h1>
                    <p style={{width:"50%",textAlign:"center"}}>Browse the library on the left to start your premium viewing experience.</p>
                    <div className="hLine"></div>
                    <p>WAITING FOR INPUT</p>
                </div>
            </>
        )
    }
    return(
        <>
        {console.log(movie)}
            <div className="selectedMovie" style={{filter:confirmDiv?`blur(10px)`:''}}>
                <img src={movie.url} alt={movie.image} />
                <div>
                    <p>• {movie.genre} • {movie.year} </p>
                    <h1>{movie.title?movie.title.toUpperCase():movie.title}</h1>
                    <h6>{movie.description}</h6>
                    <hr />
                    <div className="char">
                        <div className="director">
                            <p>DIRECTER</p>
                            <h5>{movie.director}</h5>
                        </div>
                        <div className="leadCast">
                            <p>LEAD CAST</p>
                            <h5>{movie.cast}</h5>
                        </div>
                        <div className="rating">
                            <p>RATING</p>
                            <i class="fa-solid fa-star"></i>  {movie.rating}/10
                        </div>
                    </div>
                </div>
            </div>
        </>
    )   
}