import onnapak from './../../assets/onnapak.png';
function Members(props){
    return <>
        <div className='memberDiv'>
            <img className='memberImg' src={onnapak} alt="" />
            <div>
                <p className='nameval'>{props.membername}</p>
                <p className='statusval'>{props.status}</p>
            </div>
        </div>
    </>
}

export default Members;