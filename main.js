const input = document.querySelector('input');
const logged_user = localStorage.getItem("logged_user");
const user_name_display = document.getElementById("user_name_display");
const errorMsg = document.querySelector('p.error-message');

const pokemonName = document.querySelector('p.name');
const pokemonHeight = document.querySelector('p.height');
const pokemonWeight = document.querySelector('p.weight');
const pokemonPicture = document.querySelector('img.poke-pic');
const pokemonBackPicture = document.querySelector('img.poke-back-pic');
const pokemonStatsDiv = document.getElementById("stats");
const pokemonTypesDiv = document.getElementById("types");

const labels = [
labelName = document.getElementById("poke-name"),
labelType = document.getElementById("poke-type"),
labelHeight = document.getElementById("height"),
labelWeight = document.getElementById("weight"),
labelStats = document.getElementById("poke-stats")
];

const apiInfo = {
    //https://pokeapi.co/docs/v2#pokemon
    link : 'https://pokeapi.co/api/v2/pokemon/'
}

hideLabels();
getUserName();

function getPokemon(){

    const search = input.value.toLowerCase().trim();
    const URL = `${apiInfo.link}${search}`;
    console.log(URL);

    axios.get(URL).then((response) => {
        console.log(`response status = ${response.status}`);
        console.log(response.data);
        pokemonName.textContent = `${response.data.name}`;
        pokemonHeight.textContent = `${response.data.height * 10} cm`; //decimeters
        pokemonWeight.textContent = `${response.data.weight / 10} kg`; //hectograms WTF!?
        pokemonPicture.setAttribute("src", `${response.data.sprites.front_default}`);
        pokemonBackPicture.setAttribute("src", `${response.data.sprites.back_default}`);
        pokemonBackPicture.style.display = "flex";
        fillStats(response.data.stats);
        fillType(response.data.types);
        showLabels();

        errorMsg.textContent = '';
    }).catch((error) => {
        console.log(error);
        if (error === 'AxiosError: Request failed with status code 404' ){
            errorMsg.textContent = 'Nie znaleziono pokemona';
            errorMsg.style = 'color: magenta';
        }
        console.log(`error: ${error}`);

        [pokemonName, pokemonHeight].forEach((el) => {
            el.textContent = ''
        });
    }).finally(() => {
        input.value= '';
    })
}

function getPokemonByEnter (e){
    if (e.key === 'Enter'){
        getPokemon();
    }
}

function getUserName(){
    const logged_user = localStorage.getItem("logged_user");
    console.log(logged_user);
    if(logged_user){
        user_name_display.innerHTML = `<p>Zalogowany użytkownik: <strong>${logged_user}</strong></p><button class="btn btn-sm btn-outline-dark" onclick="logOut()">Wyloguj</button>`
    }else {
        user_name_display.innerHTML = '';
    }
}

function logOut(){
    localStorage.removeItem("logged_user");
    getUserName();
}

function fillStats(stats){
    pokemonStatsDiv.innerHTML = '';
    for (const stat of stats) {
        const statDiv = document.createElement('div');
        statDiv.className ="stats-div";
        const statValue = document.createElement('p');
        const statName = document.createElement('p');

        statName.textContent = stat.stat.name;
        statValue.textContent = stat.base_stat;
        statName.className = "stat-label"
        statValue.className = "stat-value"

        statDiv.appendChild(statName);
        statDiv.appendChild(statValue);
        pokemonStatsDiv.appendChild(statDiv);
    }
}

function fillType(types){
    pokemonTypesDiv.innerHTML = '';
    for (const type of types) {
        const statDiv = document.createElement('div');
        statDiv.className ="stats-div";
        const typeParagraph = document.createElement('p');

        typeParagraph.textContent = type.type.name;
        typeParagraph.className = "stat-value"

        statDiv.appendChild(typeParagraph);
        pokemonTypesDiv.appendChild(statDiv);
    }
}

function hideLabels(){
    for (const label of labels) {
        label.style.display = "none"
    }
}

function showLabels(){
    for (const label of labels) {
        label.style.display = "block"
    }
}

input.addEventListener('keypress', getPokemonByEnter)
input.addEventListener("DOMContentLoaded", getUserName)