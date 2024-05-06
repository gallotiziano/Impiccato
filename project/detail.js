
const token = "839ab0d3-070b-4298-8e8e-62bed11c7adb";
const chiave = "progetto-poi";
const urlSet = "https://ws.progettimolinari.it/cache/set";
const urlGet = "https://ws.progettimolinari.it/cache/get";

const photoTemplate=`<div class="carousel-item">
  <img class="d-block w-100" title="source: imgur.com" src="%imagesrc" alt="%imagesrc">
  </div>`
  
  const firstPhoto =`<div class="carousel-item active">
  <img class="d-block w-100" title="source: imgur.com" src="%firstimg" alt="%firstimg">
  </div>`
  
  const templateNew = `<div class="container">
  <div class="row">
    <div class="col"><p class="font-weight-bold">Nome</p></div>
    <div class="col"><h4>%nomepoi</h4></div>
    <div class="w-100"></div>
    <div class="col"><p class="font-weight-bold">Foto</p></div>
    <div class="col">
    <div id="carouselExampleControls1" class="carousel slide" data-ride="carousel">
    <div id="photos" class="carousel-inner">
      
    </div>
    <a class="carousel-control-prev" href="#carouselExampleControls1" role="button" data-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#carouselExampleControls1" role="button" data-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
  </div>
    </div>
    <div class="w-100"></div>
    <div class="col"><p class="font-weight-bold">Descrizione</p></div>
    <div class="col"> <p> 
        %descrizione</p></div>
    <div class="w-100"></div>
    <div class="col"><p class="font-weight-bold">Coordinate</p></div>
    <div class="col">%coord</div>
  </div>
  </div>`
  
  
  const template = `<div class="container">
  <div class="row">
    <div class="col"><p class="font-weight-bold">Nome</p></div>
    <div class="col"><h4>%nomepoi</h4></div>
    <div class="w-100"></div>
    <div class="col"><p class="font-weight-bold">Foto</p></div>
    <div class="col">
      <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
        <div id="photos" class="carousel-inner">
        </div>
        <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
      </div>
    </div>
    <div class="w-100"></div>
    <div class="col"><p class="font-weight-bold">Descrizione</p></div>
    <div class="col"> <p> 
        %descrizione</p></div>
    <div class="w-100"></div>
    <div class="col"><p class="font-weight-bold">Coordinate</p></div>
    <div class="col">%coord</div>
  </div>
  </div>`
  


const renderAll = (element) =>{
  document.getElementById("title-name-detail").innerText = "Detail page - "+element.nome;
  document.title="DETAIL - "+element.nome;
  console.log(element.immagine)
  let html ="";
  let row="";
  const coord = element.coordinate.latitudine + ", "+ element.coordinate.longitudine;
  row=templateNew.replace("%nomepoi", element.nome).replace("%descrizione", element.descrizione).replace("%coord", coord);
  html=row;
  document.getElementById("detail").innerHTML=html;
  
  const backPage = Cookies.get('back');
  document.getElementById("back-button-a").href="https://nuzzacigianluca.github.io/bologna/project/"+backPage;
  
}   


const renderPhotos = (element) =>{
let html ="";
//let row="";
row=firstPhoto.replaceAll("%firstimg", element.immagine[0]);
html+=row;

for (let i = 1; i <= element.immagine.length; i++) {
    if(element.immagine[i]){
      row=photoTemplate.replaceAll("%imagesrc", element.immagine[i]);
      html+=row;
    }
    
}
document.getElementById("photos").innerHTML=html;
}


const findPoi=(poi)=>{
  let find = false;
  array.forEach((element)=>{
      if(element.id==poi){
        find=true;
        renderAll(element)
        renderPhotos(element)
      }
  })
  if(find==false){
    document.getElementById("main").innerHTML = `
  <h2 style="text-align: center; margin-top: 30px;">IL POI NON ESISTE</h2>`;
  }
}

const get = (poi) => {
  fetch(urlGet, {
    headers: {
      "Content-Type": "application/json",
      key: token
    },
    method: "POST",
    body: JSON.stringify({
      key: chiave
    })
  })
    .then((r) => r.json())
    .then((r) => {
      array = r.result;
      findPoi(poi)
    })
};

const main = () => {
  
  
  
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const poi = urlParams.get('poi');

  if(poi){
    get(poi);
  }else{
    document.getElementById("main").innerHTML = `
  <h2 style="text-align: center; margin-top: 30px;">NON HAI SELEZIONATO NESSUN POI</h2>`;
  }
  
  
  
  const logoutButton = document.getElementById("log-out");
  logoutButton.onclick = () => {
    Cookies.set('logged-user','false');
    window.location.href = "login.html";
  }
}



const logged = Cookies.get('logged-user');
console.log(logged);
if(logged=="true"){
  main();
}else{
  document.getElementById("main").innerHTML = `
  <h2 style="text-align: center; margin-top: 30px;">NON SEI LOGGATO</h2>`
}
