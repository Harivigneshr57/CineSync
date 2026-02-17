export default function TrendingContainer({src}){
    return (
        <>
            <div className="trendingMovie">
                <img src={src} alt="Trending Movie" />
            </div>
        </>
    )
}