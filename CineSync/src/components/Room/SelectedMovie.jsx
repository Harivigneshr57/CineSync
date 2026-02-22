import Avenger from '../../assets/Avenger.png';
import Interstellar from '../../assets/bigMovie.png';
import KGF from '../../assets/KGF.png';
import Leo from '../../assets/Leo.png';
import LoveToday from '../../assets/LoveToday.png';
import Master from '../../assets/Master.png';
import SpiderMan from '../../assets/SpiderMan.png';
import Thunivu from '../../assets/Thunivu.png';
export default function SelectedMovie({movie}){
    if(movie.image==undefined){
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
            <div className="selectedMovie" style={{backgroundImage : `url(${movie.image})`}} >
                <p>• {movie.genre} • {movie.year} </p>
                <h1>{movie.title.toUpperCase()}</h1>
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
        </>
    )   
}