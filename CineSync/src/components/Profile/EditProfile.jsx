import def from '../../assets/onnapak.png'
import { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../Login-SignIn/UserContext';
function EditProfile(props) {
    const [image, setbg] = useState("");
    const [name, setName] = useState(props.defusername);
    const [bio, setbio] = useState(props.defbio);
    const { user, changeUser } = useContext(UserContext);
    const imageRef = useRef(null);
    useEffect(() => {
        setName(props.defusername);
        setbio(props.defbio);
    }, [props.defusername, props.defbio]);

    return <>
        <div className="edit-profile-tab" style={{ display: props.isEditable ? 'flex' : 'none' }}>
            <div className="profile-edit-form">
                <div>
                    <h2>Edit Hub Profile</h2>
                    <p style={{ color: "#9ca3af", marginTop: "10px" }}>Update your profile information and display preferences</p>
                </div>
                <div className="profile-edit-image-row">
                    <div onClick={()=>imageRef.current.click()} className="profile-edit-imageholder" style={{ backgroundImage: image ? `url(${image})` : `url(${def})` }}></div>
                    <input ref={imageRef} style={{display:"none"}} className="change-profile-image" type="file" accept=".jpg, .jpeg, .png" onChange={changeImage}></input>
                    <div onClick={()=>imageRef.current.click()} className='choose'>Choose File</div>
                
                </div>
                <p style={{color:"var(--major)"}}>*Upload an image in square format for best results.</p>
                <div className="inputspace">
                    <label htmlFor="name">Profile Name</label>
                    <input onChange={(e) => { changeName(e) }} value={name} type="text" id="name" spellCheck={false} autoComplete="false" maxLength={15} />
                </div>
                <div className="inputspace">
                    <label htmlFor="bio">Bio</label>
                    <textarea onChange={(e) => { changebio(e) }} value={bio} type="text" id="bio" spellCheck={false} maxLength={30} />
                </div>
                <button className="profile-edit-save" onClick={async () => {
                    await saveChanges();
                    props.hideedit();
                }}>Save changes</button>
                <button className="profile-edit-cancel" onClick={() => { props.hideedit() }}>Cancel</button>
            </div>
        </div>
    </>

    async function saveChanges() {
        const formData = new FormData();
        const finalName = name.trim() === "" ? user.username : name;
        let finalBio = bio && bio.trim() === "" ? user.bio : bio;
        formData.append("oldname", user.username);
        formData.append("name", finalName);
        formData.append("bio", finalBio);
        const fileInput = document.querySelector(".change-profile-image");
        if (fileInput.files[0]) {
            formData.append("image", fileInput.files[0]);
        }

        const updateRes = await fetch("https://cinesync-3k1z.onrender.com/editProfile", {
            method: "POST",
            body: formData
        })
        const updateData = await updateRes.json();
        if (updateData.error) {
            console.error("Update error:", updateData.error);
            return;
        }

        props.setuserName(finalName);
        props.setuserName(finalName);
        props.setbio(finalBio);
        props.setbio(finalBio);
        changeUser(finalName);
        props.setuserName(finalName);
        props.setbio(finalBio);
        if (fileInput.files[0]) {
            props.setimage(URL.createObjectURL(fileInput.files[0]));
        } else {
            props.setimage(updateData.image || "");
        }
    }

    function changeImage(e) {
        const file = e.target.files[0];

        const reader = new FileReader();
        reader.onloadend = () => {
            setbg(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }
    function changeName(e) {
        let name = e.target.value;
        setName(name);

    }
    function changebio(e) {
        let bio = e.target.value;
        setbio(bio);
    }

}


export default EditProfile;