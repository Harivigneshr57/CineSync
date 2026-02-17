export default function SearchBar({ref,ref2}){
    return (
        <div ref={ref}
        id="searchBarDiscover">
            <input ref={ref2} style={{width:"40rem"}}   id="disSearch" placeholder="Enter movie Name..."></input>

        </div>
    )
}