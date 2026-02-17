export default function TopDisBar({handleScroll}){
    return(
        <>
        <div id="disTopBar">
            <h2>Discover</h2>
            <i style={{fontSize:"2rem"}} onClick={handleScroll} class="fa-solid fa-magnifying-glass"></i>
            
        </div>
        </>
    )
}