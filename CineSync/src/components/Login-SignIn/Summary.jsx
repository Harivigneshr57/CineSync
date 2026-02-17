export default function Summary({data}){
    return (
        <>
            <details className="faq-item">
                <summary className="faq-question flex1">{data[0]}<span className="faq-icon">+</span></summary>
                <p className="faq-answer">{data[1]}</p>
            </details>
        </>
    )
}