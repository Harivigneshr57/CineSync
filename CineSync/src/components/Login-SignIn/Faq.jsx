import Summary from "./Summary";

export default function FAQ(){
    let data = [["What is CineSync?","It is a Collaborative Movie Watching Platform, Where you can see movies with your friends anywhere. It gives we Internet theatre Experience."],
                ["Where can I watch?","Watch anywhere, anytime. Sign in with your account to watch instantly on the web at onnapaarkalam.com from your personal computer or on any internet-connected device."],
                ["How much does it cost?","Now it is Available for free. After Some Period we charge amount."]];
    return(
        <>
            <div className="faqContainer flex">
                <div className="faq">
                    <h2>Frequently Asked Questions</h2>
                    {data.map((a,i)=>{
                        return <Summary data={a} key={i}></Summary>
                    })}
                </div>
            </div>
        </>
    )
}