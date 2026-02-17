import { useNavigate } from "react-router-dom"

export default function SingleMovieTop({movieName}){
    let navigate = useNavigate();
    function discover(){
        navigate('/discover')
    }
    return (
        <div id="singleTop">
            <div>
            <i class="fa-solid fa-arrow-left" onClick={discover}></i>
            <h2>{movieName}</h2>
            </div>
        </div>
    ) 
}