import movie1 from '../../assets/Bigil.png'
import movie2 from '../../assets/KGF.png'
import movie3 from '../../assets/Leo.png'
import movie4 from '../../assets/LoveToday.png'
import movie5 from '../../assets/Madharasi.png'
import movie6 from '../../assets/Master.png'
import movie7 from '../../assets/SooraraiPotru.png'
import movie8 from '../../assets/VadaChennai.png'
import movie9 from '../../assets/Thunivu.png'
import Trending from './Trending'

export default function TamilBlockBustors(){
    let arr = [
        [movie1,"Bigil"],[movie2,"KGF 2"],[movie3,"LEO"],[movie4,"Love Today"],[movie5,"Madharasi"],[movie6,"Master"],[movie7,"SooraraiPotru"],[movie8,'VadaChennai'],[movie9,"Thunivu"]
    ]
    return(
        <>
            <div className="trendingMovies">
                <h2>Tamil Block Busters</h2>
                <div className="trends">
                    {arr.map((a,i)=>{
                        return <Trending arr={a} key={i}></Trending> 
                    })}
                </div>
            </div>
        </>
    )
}