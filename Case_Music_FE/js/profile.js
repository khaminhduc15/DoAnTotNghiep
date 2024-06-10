
const firebaseConfig = {
    apiKey: "AIzaSyBGlgiTbVH4DlOZwKk4ppAVV866_FmBB9g",
    authDomain: "casemusic-5ed20.firebaseapp.com",
    projectId: "casemusic-5ed20",
    storageBucket: "casemusic-5ed20.appspot.com",
    messagingSenderId: "1056611211629",
    appId: "1:1056611211629:web:f2001f08a83b18c5aaa264",
    measurementId: "G-W0YW0KFTDT"
};

const app = firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
let file;
let fileName;
let uploadedFileName;
let imageURL;
let songURl;
let profileURL;
let currentId = null;
const getImageData = (e) => {
    file = e.target.files[0];
    fileName = Math.round(Math.random() * 9999) + file.name;
    const storageRef = storage.ref().child("music");
    const folderRef = storageRef.child(fileName);
    const uploadtask = folderRef.put(file);
    uploadtask.on(
        "state_changed",
        (snapshot) => {
            uploadedFileName = snapshot.ref.name;
        },
        (error) => {
            console.log(error);
        },
        () => {
            storage
                .ref("music")
                .child(uploadedFileName)
                .getDownloadURL()
                .then((url) => {
                    // console.log(url)
                    imageURL = url;
                    profileURL=url;
                    songURl = url;
                    document.getElementById('img_playlist').src=url
                    document.getElementById('img_album').src=url
                    document.getElementById("profilePic").src = profileURL;
                    document.getElementById("profilePic").style.display = 'block';
                    document.getElementById(`song-url`).src = url;
                    document.getElementById("save-song-button").style.display = `block`;
                });
        }
    );
};
document.getElementById('editProfile').addEventListener('click', function () {

    formEditUser.style.display = "block";
    document.getElementById("profiles").style.display = "none";

})


function profile() {
    let newBackground = document.getElementById("profiles");
    newBackground.style.display = "block";

}

function dataProfile(currentId) {
    axios.get(`http://localhost:8080/users/` + currentId, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res=>{
        // console.log(res.data)
        document.getElementById('nameU').value=res.data.name
        document.getElementById('email').value=res.data.username
        document.getElementById('phoneu').value=res.data.phone
        document.getElementById('profilePics').src=res.data.avatar
        currentId = id
    })
}
function edit() {
    let name = document.getElementById("name").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let phone = document.getElementById("phone").value;
    let data = {
        id: currentId,
        password: password,
        confirmPassword: confirmPassword,
        enabled: true,
        name: name,
        avatar: imageURL,
        phone: phone
    }
    // console.log("edit", data)
    axios.put(`http://localhost:8080/users/` + currentId, data, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(() => {
        alert("Edit Done")
        document.getElementById("formEdit").style.display = "none";
        document.getElementById("profiles").style.display = "none";
    })
    window.location.reload();
}

function backHome() {
    document.getElementById("profiles").style.display = "none";
    document.getElementById("originnal-backround").style.display = "block";

}

function backProfile() {
    document.getElementById("formEdit").style.display = "none";
    document.getElementById("profiles").style.display = "block";
}

