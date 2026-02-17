import SideBar from "./SideBar"
import BigMovie from "./BigMovie"
import TrendingMovie from "./TrendingMovie"
import TamilBlockBustors from "./TamilBlockBusters"
import './home.css'
export default function Home(){
    return(
        <>
            <div className="home">
                <SideBar>
                </SideBar>
                <div className="mainDiv">
                    <BigMovie></BigMovie>
                    <TrendingMovie></TrendingMovie>
                    <TamilBlockBustors></TamilBlockBustors>
                </div>
            </div>
        </>
    )
}