let newBackground = document.getElementById("new-background");
let homeUser = document.getElementById("home")
let signup = document.getElementById("signup-background")
let forUser1 = document.getElementById("for-user1")
let createAlbum = document.getElementById("createAlbum")
let loginNav = document.getElementById("login-nav")
let profileNav = document.getElementById("profile-nav")
let playlist = document.getElementById("playlist-nav-bar")
let album = document.getElementById("album-nav-bar")
let adminBox = document.getElementById("admin-background")
let background_user = document.getElementById("back-user")
let playingBar = document.getElementById("playing-bar")
let functionBar = document.getElementById("function")
let currentPage = 1;
let totalPages = 0;
const itemsPerPage = 10;
let token = localStorage.getItem('userToken');
let role = localStorage.getItem('role');
let choicePlaylist1 = document.getElementById("choice-playlist1")
let choicePlaylist2 = document.getElementById("choice-playlist2")
let choicePlaylist3 = document.getElementById("choice-playlist3")
let playlistSelected = document.getElementById("playlist-selected")
let c = document.getElementById("home-btn")
let authorBackground = document.getElementById("author-background")
let itemDiv = ""
window.onload = function () {
    loginUser()
    let greetingElement = document.getElementById('good-something');
    let currentTime = new Date().getHours();

    if (currentTime < 12) {
        greetingElement.textContent = 'Good morning!';
    } else if (currentTime < 18) {
        greetingElement.textContent = 'Good afternoon!';
    } else {
        greetingElement.textContent = 'Good evening!';
    }
}
document.getElementById("myButton").addEventListener("click", function () {
    newBackground.style.display = "block";
    home.style.opacity = "75%";
});
document.getElementById("login-box").addEventListener("click", function () {
    newBackground.style.display = "block";
    signup.style.display = "none";
    home.style.opacity = "75%";
});
document.getElementById("signup-box").addEventListener("click", function () {
    signup.style.display = "block";
    newBackground.style.display = "none";
    home.style.opacity = "75%";
});
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    let username = document.querySelector('[name="username"]').value;
    let password = document.querySelector('[name="password"]').value;
    let dataLogin = {
        "username": username,
        "password": password
    }
    axios.post(`http://localhost:8080/login`, dataLogin).then(res => {
        localStorage.setItem('userToken', res.data.accessToken);
        localStorage.setItem('role', res.data.roles[0].authority);
        localStorage.setItem('currentId', res.data.id);
        loginUser()
        window.location.reload();
    })
        .catch(error => {
            console.error(error);
            if (error.response && error.response.status === 401) {
                alert("User account or password incorrect");
                document.getElementsByName('username')[0].value = '';
                document.getElementsByName('password')[0].value = '';
            }
        })
});

document.getElementById("signupForm").addEventListener('submit',function ( event ) {
    event.preventDefault();
    let dataSignup = {
        username : document.getElementById('usernameSignup').value,
        password : document.getElementById('passwordSignup').value,
        confirmPassword :document.getElementById('confirmPasswordSignup').value,
        name : document.getElementById('usernameSignup').value,
        phone : 0
    }
    let idRoles = document.getElementById('select-role');
    let selectedOption = idRoles.options[idRoles.selectedIndex];
    let id = selectedOption.value;
        axios.post(`http://localhost:8080/register/${id}`,dataSignup).then(()=>{
            document.getElementById('new-background').style.display='block'
            document.getElementById('signup-background').style.display='none'
            alert('Sign Up Success!')
        })
        .catch(error => {
            if (error.response.data === "Username existed")
           alert("Username existed")
            document.getElementById('usernameSignup').value = '';
            document.getElementById('passwordSignup').value = '';
            document.getElementById('confirmPasswordSignup').value = '';
            document.getElementById('nameSignup').value = '';
            document.getElementById('phoneSignup').value = '';
        });

})

function loginUser() {
    currentId = localStorage.getItem("currentId")
    dataProfile(currentId)
    if (token !== null && role === 'ROLE_USER') {
        userView();
    } else if (token !== null && role === 'ROLE_ADMIN') {
        showListUser();
    } else if (token !== null && role === `ROLE_AUTHOR`) {
        showSongByAuthorId()
    }

}

function userView() {
    axios.get('http://localhost:8080/api/playLists/' + currentId, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => {
        const playlistList = document.getElementById("playlist-list");
        playlistList.innerHTML = '';
        res.data.forEach((item) => {
            if (item.status !== 'Deleted') {
                itemDiv = document.createElement("div");
                itemDiv.setAttribute("data-id", item.id);
                const img = document.createElement("img");
                img.setAttribute("src", item.avatar);
                img.setAttribute("alt", "Playlist image");
                const name = document.createElement("p");
                name.classList.add("name-item");
                name.textContent = item.name;
                itemDiv.appendChild(img);
                itemDiv.appendChild(name);
                playlistList.appendChild(itemDiv);
                itemDiv.addEventListener('click', function () {
                    const playlistId = this.getAttribute("data-id");
                    itemDiv.id = `play-list${playlistId}`;
                    axios.get(`http://localhost:8080/api/song-playlist/${playlistId}`).then(res => {
                            // console.log(res.data)
                            const songs = res.data.map(item => item.song);
                            localStorage.setItem('listSongs', JSON.stringify(songs))
                            background_create_playlist.style.display = "none";
                            backgroundSearch.style.display = "none";
                            choicePlaylist2.style.display = "none";
                            createAlbum.style.display = "none"
                            background_user.style.display = "block";
                            playlistSelected.style.display = "block";
                            document.getElementById('choice-new').style.display = 'none';
                            document.getElementById('choice-album').style.display = 'none';
                            let str = `<div id="playlist-selected-tiem">
                                            <div class="top-top">
                                                <div class="top">
                                                    <img src="${item.avatar}" alt="">
                                                    <h2>${item.name}</h2>
                                                    <button onclick="deletePlayList(${item.id})"><h2 style="color: red">Delete</h2></button>
                                                    <button id="addSongToPlaylist" class="btn-save" onclick="addSongToPlaylist(${playlistId})" style="margin-left: 30px; width: 100px">Add Song To Playlist Now</button>
                                                </div>
                                                <div class="play-playlist-btn" >
                                                    <i class="fa-regular fa-circle-play pause" id="displayPlay" onclick="playList()"></i>
                                                    <i class="fa-regular fa-circle-pause pause" style="display: none" id="pauseMusic"></i>
                                                </div>
                                            </div>
                                            <hr>
                                            <div class="bot">
                                            <table id="playlist-selected-table">
                                            <tr>
                                            <th>Song name</th>
                                            <th>Album</th>
                                            <th>Likes</th>
                                            <th>Listens</th>
                                            <td>Action</td>
                                            </tr>`
                            res.data.forEach((item, index) => {
                                // console.log("test", item.song)
                                str += `
<tr>
<td class="play-song" data-index="${index}">${item.song.name}</td>
<td>${item.song.album.name}</td>
<td>${item.song.likes}</td>
<td>${item.song.listens}</td>
<td><button onclick="deleteSong(${item.id})" class="signup-btn">Delete</button></td>
</tr>
`
                            })
                            str += `</table></div></div>`
                            playlistSelected.innerHTML = str
                            document.querySelectorAll('.play-song').forEach(item => {
                                item.addEventListener('click', function () {
                                    const index = parseInt(this.getAttribute('data-index'), 10);
                                    localStorage.setItem('activeSongList', 'saveListSongs');
                                    playSong(index);
                                });
                            });

                    })
                });
            }
        });
        newBackground.style.display = "none";
        homeUser.style.display = "block";
        forUser1.style.display = "flex"
        createAlbum.style.display="none"
        home.style.opacity = "100%";
        loginNav.style.display = "none";
        profileNav.style.display = "flex";
        playlist.style.display = "flex"
        document.getElementById('choice-new').style.display = 'block';
        document.getElementById('choice-album').style.display = 'block';
    })
}
function deleteSong(id) {
    // console.log(id);
    axios.delete(`http://localhost:8080/api/song-playlist/` + id)
        .then(() => {
            alert('Song has been deleted from the playlist');
            window.location.reload();
        })
        .catch(error => {
            console.error('There was an error deleting the song:', error);
        });
}
function addSongToPlaylist(playlistId){
    document.getElementById('addSongToPlaylist').style.display = 'none'
    localStorage.setItem('playlistId', playlistId);
    let str = `<div class="background-show-song" id="background-show-song-playlist">
                    <div class="search-song">
                        <label><input type="text" id="searchSong" placeholder="Tìm kiếm bài hát..."
                                      oninput="searchSong2()"></label>
                    </div>
                    <div class="display-song" id="show">
                    </div>
                </div>`
    document.getElementById('playlist-selected-table').innerHTML = str
    axios.get(url).then(res => {
        let str = ` <table class="all-song-tb">
                            <tr class="all-song-thead">
                                <th></th>
                            <th>Name Song</th>
                            <th>Name Singer</th>
                            <th>Album</th>
                            <th>Category</th>
                            <th></th>
                            </tr>`;
        res.data.forEach((item, index) => {
            str += `<tr class="all-song-tbody">
                                <td><img src="${item.album.avatar}" style="width: 50px;height: 50px;margin-top: 10px;margin-left: 30px"></td>
                                <td>${item.name}</td>
                                <td>${item.singer.name}</td>
                                <td>${item.album.name}</td>
                                <td>${item.category.name}</td>
                                <td><button onclick="postSongPlaylist(${item.id})" >Add</button></td>
                            </tr>`
        })
        str += `</table>`;
        document.getElementById(`show`).innerHTML = str;
    })
}

function deletePlayList(id) {
    // console.log(id);
    axios.delete(`http://localhost:8080/api/playLists/` + id)
        .then(() => {
            alert('Playlist has been deleted');
            window.location.reload();
        })
        .catch(error => {
            console.error('There was an error deleting:', error);
        });

}
document.getElementById("xLogin-btn").addEventListener("click", function () {
    newBackground.style.display = "none";
    home.style.opacity = "100%";
});
document.getElementById("xSignup-btn").addEventListener("click", function () {
    signup.style.display = "none";
    home.style.opacity = "100%";
});

document.getElementById("main-view").addEventListener("click", function () {
    newBackground.style.display = "none";
    document.getElementById("formEdit").style.display = "none";
    signup.style.display = "none";
    home.style.opacity = "100%";
});
document.getElementById("home-btn").addEventListener("click", function () {
    if (token !== null && role === 'ROLE_ADMIN') {
        window.location.reload();
        authorBackground.style.display="none";
    } else if (token !== null && role === 'ROLE_AUTHOR') {
        showSongByAuthorId()
        authorBackground.style.display="block";
        document.getElementById('label_showAllSong').style.display='block';
        background_create_album.style.display="none";
    } else if (token !== null && role === 'ROLE_USER') {
        window.location.reload();
        background_create_playlist.style.display="none";
        backgroundSearch.style.display="none";
        createAlbum.style.display="none"
        authorBackground.style.display = "none"
        choicePlaylist2.style.display = "block";
        playlistSelected.style.display = "none"
        background_user.style.display = 'block';
        background_author.style.display="none";
        background_create_album.style.display="none";
        document.getElementById('choice-new').style.display = 'block';
        document.getElementById('choice-album').style.display = 'block';
    } else {
        window.location.reload()
    }
});
document.getElementById("logout").addEventListener("click", function () {
    localStorage.clear();
    window.location.reload();

})

function showListUser() {
    document.getElementById('list-allsong').style.display='block'
    document.getElementById('list-allsinger').style.display='block'
    document.getElementById('list-allcategory').style.display='block'
    document.getElementById('search').style.display = 'none'
    profileNav.style.display = "flex";
    adminBox.style.display = "block";
    background_user.style.display = "none";
    authorBackground.style.display = "none"
    forUser1.style.display = "none"
    createAlbum.style.display="none"
    newBackground.style.display = "none";
    home.style.opacity = "100%";
    loginNav.style.display = "none";
    playlist.style.display = "none";
    playingBar.style.background = "#121212";
    functionBar.style.display = "none";
    document.getElementById(`home-page-title`).innerHTML = `Admin`
    axios.get(`http://localhost:8080/admin`).then(response => {
        let data = response.data;
        totalPages = Math.ceil(data.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, data.length);
        let str = `
                <h1 style="color: white">List User</h1>
                    <table id="user-table-1">
                        <tr>
                            <th>Avatar</th>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Enabled</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th></th>
                        </tr>`;
        for (let i = startIndex; i < endIndex; i++) {
            let user = data[i];
            let enabledStatus = user.enabled ? `Active` : `Inactive`;
            let roleStatus = user.roles[0].name === "ROLE_USER" ? `User` : `Author`;
            str += `<tr>
                        <td id="avt-${user.id}"><img src=${user.avatar} alt="User Avatar" style="width: 80%"></td>
                        <td id="username-${user.id}">${user.username}</td>
                        <td id="name-${user.id}">${user.name}</td>
                        <td id="enabled-${user.id}">${enabledStatus}</td>
                        <td id="phone-${user.id}">${user.phone}</td>
                        <td id="roles-${user.id}">${roleStatus}</td>
                        <td><button onclick="changeEnabled(${user.id})" class="btn btn-success">Change</button></td>
                    </tr>`;
        }
        str += `</table>`;
        if (totalPages > 1) {
            str += `<div class="user-table-btn">
                    <button onclick="previousPage1()">Previous</button>
                    <button onclick="nextPage1()">Next</button>
                    </div>`;
        }
        document.getElementById('user-table').innerHTML = str;
    }).catch(error => {
        console.error('Error fetching user data:', error);
    });
}

function changeEnabled(id) {
    let data = {
        avt: document.getElementById(`avt-${id}`).getAttribute('src'),
        username: document.getElementById(`username-${id}`).value,
        name: document.getElementById(`name-${id}`).value,
        enabled: document.getElementById(`enabled-${id}`).value,
        phone: document.getElementById(`phone-${id}`).value,
        roles: document.getElementById(`roles-${id}`).value,
    };
    axios.put(`http://localhost:8080/admin/${id}`, data).then(() => {
        showListUser();
    })
}

function previousPage1() {
    if (currentPage > 1) {
        currentPage--;
        showListUser();
    }
}

function nextPage1() {
    if (currentPage < totalPages) {
        currentPage++;
        showListUser();
    }
}
function showListAllSong(){
    axios.get(`http://localhost:8080/api/songs`).then(response => {
        let data = response.data;
        // console.log(data);
        totalPages = Math.ceil(data.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, data.length);
        let str = `
                <h1 style="color: white">List All Song</h1>
                    <table id="user-table-1">
                        <tr>
                            <th>Name</th>
                            <th>Singer</th>
                            <th>Author</th>
                            <th>Album</th>
                            <th>Category</th>
                            <th>Likes</th>
                            <th>Listens</th>
                            <th></th>
                        </tr>`;
        for (let i = startIndex; i < endIndex; i++) {
            let song = data[i];
            let singer_name = song.singer.name;
            let author_name = song.author.username;
            let album_name = song.album.name;
            let category_name = song.category.name;
            str += `<tr>
                        <td id="name-${song.id}">${song.name}</td>
                        <td id="singer-${song.id}">${singer_name}</td>
                        <td id="author-${song.id}">${author_name}</td>
                        <td id="album-${song.id}">${album_name}</td>
                        <td id="category-${song.id}">${category_name}</td>
                        <td id="likes-${song.id}">${song.likes}</td>
                        <td id="listens-${song.id}">${song.listens}</td>
                        <td><button onclick="DeleteSong(${song.id})" class="btn btn-success">Delete</button></td>
                    </tr>`;
        }
        str += `</table>`;
        if (totalPages > 1) {
            str += `<div class="user-table-btn">
                    <button onclick="previousPage2()">Previous</button>
                    <button onclick="nextPage2()">Next</button>
                    </div>`;
        }
        document.getElementById(`user-table`).innerHTML = str;
    }).catch(error => {
        console.error('Error fetching user data:', error);
    });
}
function previousPage2() {
    if (currentPage > 1) {
        currentPage--;
        showListAllSong();
    }
}

function nextPage2() {
    if (currentPage < totalPages) {
        currentPage++;
        showListAllSong();
    }
}
function DeleteSong(id){
    axios.delete(`http://localhost:8080/api/songs/${id}`).then(() => {
        showListAllSong();
    })
}
function showListAllSinger(){
    axios.get(`http://localhost:8080/api/singers`).then(response => {
        let data = response.data;
        // console.log(data);
        totalPages = Math.ceil(data.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, data.length);
        let str = `
                <h1 style="color: white">List All Singer</h1>
                <button onclick="showAddSingerForm()" id="create-song-button"><i class="fa-solid fa-plus"></i></button>
                    <table id="user-table-1">
                        <tr>
                            <th>STT</th>
                            <th>Name</th>
                            <th></th>
                            <th></th>
                        </tr>`;
        for (let i = startIndex; i < endIndex; i++) {
            str += `<tr>
                        <td id="STT-${data[i].id}">${i+1}</td>
                        <td id="singer-${data[i].id}">${data[i].name}</td>
                        <td id="edit-save-${data[i].id}"><button onclick="showEditSinger(${data[i].id})" id="edit-singer-${data[i].id}" class="btn btn-success">Edit</button></td>
                        <td><button onclick="DeleteSinger(${data[i].id})" class="btn btn-success">Delete</button></td>
                    </tr>`;
        }
        str += `</table>`;
        if (totalPages > 1) {
            str += `<div class="user-table-btn">
                    <button onclick="previousPage3()">Previous</button>
                    <button onclick="nextPage3()">Next</button>
                    </div>`;
        }
        document.getElementById(`user-table`).innerHTML = str;
    }).catch(error => {
        console.error('Error fetching user data:', error);
    });
}
function previousPage3() {
    if (currentPage > 1) {
        currentPage--;
        showListAllSinger();
    }
}

function nextPage3() {
    if (currentPage < totalPages) {
        currentPage++;
        showListAllSinger();
    }
}
function showEditSinger(id){
    axios.get(`http://localhost:8080/api/singers/${id}`).then(r => {
        let data = r.data;
        let str = `<input type="text" id="id-editname" value="${data.name}" >`
        document.getElementById(`singer-`+id).innerHTML = str
        document.getElementById(`edit-singer-`+id).style.display = 'none'
        document.getElementById(`edit-save-`+id).innerHTML = `<button onclick="EditSinger(${data.id})" class="btn btn-success">Save</button>`
    })
}
function EditSinger(id){
    let name = document.getElementById('id-editname').value
    // console.log(name)
    let singer = {
        name : name,
        author_id : null,
    }
    axios.put(`http://localhost:8080/api/singers/`+id, singer).then(() =>{
        showListAllSinger()
    })


}
function DeleteSinger(id) {
    axios.delete(`http://localhost:8080/api/singers/${id}`).then(() => {
        showListAllSinger();
    })
}
function showAddSingerForm(){
    let str = `
    <h1 style="color: white">Add Singer</h1>
    <label>Name: <input type="text" name="name" id="id-name"></label>
    <button onclick="addSinger()" id="save-song-button">Save</button>
    `
    document.getElementById('user-table').innerHTML = str;
}
function addSinger(){
    let name = document.getElementById('id-name').value
    if (name == {}){
        alert("Please Enter Singer Name!")
    }
    else {
        let data = {
            name : document.getElementById('id-name').value,
        }
        axios.post(`http://localhost:8080/api/singers`, data).then(() => {
            showListAllSinger()
        })
    }
}

function showListAllCategory(){
    axios.get(`http://localhost:8080/api/categories`).then(response => {
        let data = response.data;
        // console.log(data);
        totalPages = Math.ceil(data.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, data.length);
        let str = `
                <h1 style="color: white">List All Category</h1>
                <button onclick="showAddCategoryForm()" id="create-song-button"><i class="fa-solid fa-plus"></i></button>
                    <table id="user-table-1">
                        <tr>
                            <th>STT</th>
                            <th>Name</th>
                            <th></th>
                            <th></th>
                        </tr>`;
        for (let i = startIndex; i < endIndex; i++) {
            str += `<tr>
                        <td id="STT-${data[i].id}">${i+1}</td>
                        <td id="category-${data[i].id}">${data[i].name}</td>
                        <td id="edit-save-${data[i].id}"><button onclick="showEditCategory(${data[i].id})" id="edit-category-${data[i].id}" class="btn btn-success">Edit</button></td>
                        <td><button onclick="DeleteCategory(${data[i].id})" class="btn btn-success">Delete</button></td>
                    </tr>`;
        }
        str += `</table>`;
        if (totalPages > 1) {
            str += `<div class="user-table-btn">
                    <button onclick="previousPage4()">Previous</button>
                    <button onclick="nextPage4()">Next</button>
                    </div>`;
        }
        document.getElementById(`user-table`).innerHTML = str;
    }).catch(error => {
        console.error('Error fetching user data:', error);
    });
}
function previousPage4() {
    if (currentPage > 1) {
        currentPage--;
        showListAllCategory();
    }
}

function nextPage4() {
    if (currentPage < totalPages) {
        currentPage++;
        showListAllCategory();
    }
}
function showEditCategory(id){
    axios.get(`http://localhost:8080/api/categories/${id}`).then(r => {
        let data = r.data;
        let str = `<input type="text" id="id-editname" value="${data.name}" >`
        document.getElementById(`category-`+id).innerHTML = str
        document.getElementById(`edit-category-`+id).style.display = 'none'
        document.getElementById(`edit-save-`+id).innerHTML = `<button onclick="EditCategory(${data.id})" class="btn btn-success">Save</button>`
    })
}
function EditCategory(id){
    let name = document.getElementById('id-editname').value
    // console.log(name)
    let category = {
        name : name,
    }
    axios.put(`http://localhost:8080/api/categories/`+id, category).then(() =>{
        showListAllCategory()
    })


}
function DeleteCategory(id) {
    axios.delete(`http://localhost:8080/api/categories/${id}`).then(() => {
        showListAllCategory();
    })
}
function showAddCategoryForm(){
    let str = `
    <h1 style="color: white">Add Category</h1>
    <label>Name: <input type="text" name="name" id="id-name"></label>
    <button onclick="addCategory()" id="save-song-button">Save</button>
    `
    document.getElementById('user-table').innerHTML = str;
}
function addCategory(){
    let name = document.getElementById('id-name').value
    if (name == {}){
        alert("Please Enter Category Name!")
    }
    else {
        let data = {
            name : document.getElementById('id-name').value,
        }
        axios.post(`http://localhost:8080/api/categories`, data).then(() => {
            showListAllCategory()
        })
    }
}

