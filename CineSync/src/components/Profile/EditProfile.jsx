import def from '../../assets/onnapak.png'
import { useContext, useState } from 'react';
import { UserContext } from '../Login-SignIn/UserContext';
function EditProfile(props) {
    const[image,setbg]=useState("");
    const [name,setName]=useState("");
    const [ bio,setbio]=useState("");
    const{user,changeUser}=useContext(UserContext);
    return <>
        <div className="edit-profile-tab" style={{ display: props.isEditable ? 'flex' : 'none' }}>
            <div className="profile-edit-form">
                <div>
                    <h2>Edit Hub Profile</h2>
                    <p style={{ color: "#9ca3af" ,marginTop:"10px"}}>Update your profile information and display preferences</p>
                </div>
                <div className="profile-edit-image-row">
                    <div className="profile-edit-imageholder" style={{backgroundImage:image?`url(${image})`:`url(${def})`}}>
                    </div>
                    <input className="change-profile-image" type="file" accept=".jpg, .jpeg, .png" onChange={changeImage}></input>
                </div>
                <div className="inputspace">
                    <label htmlFor="name">Profile Name</label>
                    <input onChange={changeName} type="text" id="name" spellCheck={false} autoComplete="false" maxLength={15}/>
                </div>
                <div className="inputspace">
                    <label htmlFor="bio">Bio</label>
                    <textarea onChange={changebio} type="text" id="bio" spellCheck={false} maxLength={30}/>
                </div>
                <button className="profile-edit-save" onClick={()=>{
                    saveChanges();
                    props.hideedit();
                }}>Save changes</button>
                <button className="profile-edit-cancel" onClick={() => { props.hideedit() }}>Cancel</button>
            </div>
        </div>
    </>

    async function saveChanges(){
        console.log(user.username,image,name,bio);
        await fetch("https://cinesync-3k1z.onrender.com/editProfile",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({oldname:user.username,image:image,name:name,bio:bio})
        }).then((res)=>res.json())
        .then((data)=>{
            console.log(data)
            changeUser(name,data.result)
            props.setuserName(name);
            props.setbio(bio);
            props.setimage(image);
        })
        .catch((error)=>console.log(error));
    }

    function changeImage(e){
        let file=e.target.files[0];
        let url=URL.createObjectURL(file);
        console.log(url);
        setbg(url);
    }
    function changeName(e){
        let name=e.target.value;
        setName(name);

    }
    function changebio(e){
        let bio=e.target.value;
        setbio(bio);
    }
}


export default EditProfile;