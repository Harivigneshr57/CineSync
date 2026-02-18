import { useNavigate } from 'react-router-dom';
import bigMovie from '../../assets/EndGame.png'
import Button from "../Login-SignIn/Button";
import { UserContext } from '../Login-SignIn/UserContext';
import { useContext } from 'react';
export default function BigMovie(){
    const { changeMovie } = useContext(UserContext);
    let nav = useNavigate();
    function single(){
        changeMovie("","InterStellar")
        nav('/single');
    }
    return(
        <>
            <div className="bigMovieContainer">
                <img src={bigMovie} alt="bigMove" />
                <section className='bigMovieDetail'>
                    <div className="premieres">
                        <div className="tonight">
                            PREMIERES TONIGHT
                        </div>
                        <p>Action • Adventure • Sci-Fi</p>
                    </div>
                    <div className="movieName">
                        <h1>Avengers Endgame</h1>
                    </div>
                    <div className="movieDesc">
                        The universe lies in ruins after Thanos’ snap. With everything at stake, the Avengers assemble once more to reverse the devastation and fight their greatest battle yet.
                    </div>
                    <div className="watchButtons">
                        <Button icon={<i className="fa-solid fa-users"></i>} id={"friendWatch"}> Watch with Friends</Button>
                        <Button icon={<i className="fa-solid fa-play"></i>} id={"soloPlay"} onClick={single}>play</Button>
                    </div>
                </section>
            </div>
        </>
    )
}