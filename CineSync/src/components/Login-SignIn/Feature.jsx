export default function Feature({arr}){
    return(
        <>
            <div className="featureContainer">
                <h3>{arr[0]}</h3>
                <p>{arr[1]}</p>
                {arr[2]}
            </div>
        </>
    )
}