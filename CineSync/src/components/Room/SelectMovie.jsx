import Stage from "./Stage"
import SelectMovies from "./SelectMovies"
export default function SelectMovie({step,onMovie,onStep,movie}){
    function next(){
        onStep(2);
    }
    return(
        <>
            <div id="selectMovie">
                <h1>Create Room</h1>
                <input type="text" placeholder='Search for Movies....' />
                <Stage step={step}></Stage>
                <h2>Movies</h2>
                <SelectMovies onMovie={onMovie}></SelectMovies>
                {movie.image==undefined?<button id="configuration" style={{cursor:"not-allowed"}} disabled={true}>Select a Movie</button>:<button id="configuration" onClick={next}>Continue to Configuration <i class="fa-solid fa-arrow-right"></i></button>}
            </div>
        </>
    )
}