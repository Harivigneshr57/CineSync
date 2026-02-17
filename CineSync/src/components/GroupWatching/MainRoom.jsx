import SideBar from '../Home/SideBar';
import TopBar from './TopBar';
import MovieVideo from './MovieVideo';
import './group.css'
export default function MainRoom(){
    return(
        <>
            <div className="mainRoom">
                <SideBar></SideBar>
                <div className="mainDiv">
                    <TopBar></TopBar>
                    <div className="content">
                        <MovieVideo></MovieVideo>
                    </div>
                </div>
            </div>
        </>
    )
}