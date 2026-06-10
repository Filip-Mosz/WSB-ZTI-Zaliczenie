//todo merge with main.js
const login_input = document.getElementById('login');
const pass_input = document.getElementById('password');
const username_input = document.getElementById('username');
const sign_div = document.getElementById('sign');
const log_div = document.getElementById('log');
const userpass_input = document.getElementById('userpass');
const menu_div = document.getElementById('menu');
const passregex =    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
const users = getUsers();

let usrname;
let usrpass;
let current_user;

let log_in_flag = true;
let errorMessage = "";

function submitOnClick(mode){
    console.log(`mode is ${mode}`);
    if (mode === "login") {
        login(login_input.value, pass_input.value)
    } else if (mode === "register") {
        register();
    }
}

function register(){
    const users = getUsers();

    if (username_input.value.length < 5){
        errorMessage = `${errorMessage} Login powinien składać się z przynajmniej 5 znaków.`;
    }
    if (username_input.value === ""){
        errorMessage = `${errorMessage} Login nie może być pusty.`;
    }
    if (/[^a-zA-Z0-9-]/.test(username_input.value)){
        errorMessage = `${errorMessage} Login może zawierać jedynie litery, cyfry i myślnik.`
    }

    if (!passregex.test(userpass_input.value)){
        console.log(`attempted pass: ${userpass_input.value}`)
        errorMessage = `${errorMessage} Hasło powinno składać się z minimum 8 znaków, co najmniej 1 małej lub dużej litery, co najmniej 1 cyfry i co najmniej 1 znaku specjalnego.`;
    }

    if (users.some(user => user.login === username_input.value)) {
        errorMessage = `użytkownik ${username_input.value} już istnieje`;
    }

    if (errorMessage.length !== 0){
        alert(errorMessage);
    }else{
        usrname = username_input.value;
        usrpass = userpass_input.value;
        adduser(usrname, usrpass);
    }
    username_input.value = '';
    userpass_input.value = '';

}

function adduser(login, password){
    const users = getUsers();

    users.push({ login, password });

    localStorage.setItem("users", JSON.stringify(users));
    console.log(getUsers());

    console.log(`user ${usrname} with password ${usrpass} added`)
}

function login(login, password) {
    const users = getUsers();
    console.log(`attempted login: ${login} and password: ${password}`)

    current_user = users.find(
        user =>
            user.login === login &&
            user.password === password
    );
    console.log(`user found: ${current_user.login}`)
    if (current_user) {
        console.log(`current login: ${current_user.login}`)
        localStorage.setItem( "logged_user", current_user.login );
        menu_div.innerHTML = `
        <nav>
            <a href="index.html">Main page</a>
        </nav>
        `;
    } else {
        alert("Błędny login lub hasło");
    }
}

function showLog(){
    log_div.style.display = "flex";
    sign_div.style.display = "none"
}

function showRegister(){
    sign_div.style.display = "flex";
    log_div.style.display = "none"
}

function submitOnEnter(e){
    if (e.key === 'Enter'){
        if (log_in_flag){
            submitOnClick('login')
        }
        else {
            submitOnClick('register');
        }
    }
}

login_input.addEventListener('keypress', submitOnEnter);
pass_input.addEventListener('keypress', submitOnEnter);

//database mock
if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]));
    console.log(getUsers());
}

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function initializeUsers() {
    console.log('sprawdzam, czy sa użytkownicy')
    if (!localStorage.getItem("users") || users.length === 0) {
        const defaultUsers = [
            {
                login: "ash-ketchum",
                password: "world-champion"
            }
        ];
        console.log('użytkownicy zainicjalizowani')
        localStorage.setItem( "users", JSON.stringify(defaultUsers) );
        console.log(getUsers());
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initializeUsers();
});