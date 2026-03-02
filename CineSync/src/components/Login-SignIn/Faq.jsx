import Summary from "./Summary";

export default function FAQ(){
    let data = [["What is CineSync?","It is a Collaborative Movie Watching Platform, Where you can see movies with your friends anywhere. It gives us theatre Experience."],
                ["Where can I watch?","Watch anywhere, anytime. Sign in with your account to watch instantly on the web at cinesync.com from your personal computer or on any internet-connected device."],
                ["How much does it cost?","Movie access is complimentary for two weeks. Kindly contact our support team afterward to continue your subscription."]];
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