export default function Trending({arr,onClick}){
    return(
        <>
            <div className="trending" onClick={onClick}>
                <div className="homeMovieContainer" onClick={onClick}>
                    <img src={arr[0]} alt="" />
                </div>
                <h5>{arr[1]}</h5>
            </div>
        </>
    )
}