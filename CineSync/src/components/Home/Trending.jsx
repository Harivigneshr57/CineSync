export default function Trending({arr}){
    return(
        <>
            <div className="trending">
                <div className="homeMovieContainer">
                    <img src={arr[0]} alt="" />
                </div>
                <h5>{arr[1]}</h5>
            </div>
        </>
    )
}