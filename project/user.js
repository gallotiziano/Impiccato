


const main = () => {

  

  const token = "839ab0d3-070b-4298-8e8e-62bed11c7adb";
  const chiave = "progetto-poi";
  const urlSet = "https://ws.progettimolinari.it/cache/set";
  const urlGet = "https://ws.progettimolinari.it/cache/get";
  
  let array = [];
  
  
  //vista lista
  
  
  //coordinate bologna
  const lat_b= 44.494887
  const long_b=11.3426163
  
  const get = () => {
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
        renderTable(array);
      })
  };
  
  const divPoiTemplate = `
  <div class="poi" id="%id">
        <div class="external-poi">
          <div class="image-poi">
            <img src="%linkimage">
          </div>
          <div class="bottom-poi">
            <div class="nome">%nome</div>
            <div class="buttons-poi">
              
            </div>
          </div>
        </div>
        
        
      
      </div>`;
  
  
  const renderTable = (array) => {
    //render tabelle e tutto
    const divContentPoi=document.getElementById("divListView")
    divContentPoi.innerHTML = "";
    if(array.length==0){
      divContentPoi.innerHTML = "Non ci sono ancora POI"
    }
    array.forEach((poi) => {
      divContentPoi.innerHTML += divPoiTemplate.replaceAll("%id",poi.id).replace("%linkimage",poi.immagine[0]).replace("%nome",poi.nome);
    })
    
    const poiDiv = document.querySelectorAll(".poi");
    poiDiv.forEach((div) => {
      div.onclick = () => {
        let address = "https://nuzzacigianluca.github.io/bologna/project/detail.html?poi=0";
        let url = new URL(String(address));
        url.searchParams.set('poi', div.id)
        location.href = url.href;
        Cookies.set('back','user.html');
      }
    })
  }
    
  
  
  const mapFunction = () => {
    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');
    let overlay;
  
    function setLayers(map) {
      const layers = [new ol.layer.Tile({ source: new ol.source.OSM() })]; // crea un layer da Open Street Maps
      map.addLayer(new window.ol.layer.Group({ layers })); // lo aggiunge alla mappa
    }
    function setCenter(map, lonlat) {
      const center = window.ol.proj.fromLonLat(lonlat);
      map.getView().setCenter(center); //fissa il centro della mappa su una certa coppia di coordinate
    }
    function setZoom(map, zoom) {
      map.getView().setZoom(zoom); // fissa il livello di zoom
    }
    function addMarker(map, point) {
      const feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat(point.lonlat))
      });
      feature.name = point.name;
      const layer = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: [feature]
        }),
        style: new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 1],
            crossOrigin: 'anonymous',
            src: 'https://docs.maptiler.com/openlayers/default-marker/marker-icon.png',
          })
        })
      });
      map.addLayer(layer);
    }
  
    // crea un popup e gestisce l'apertura dell'overlay
    function initOverlay(map, points) {
      overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        }
      });
      map.addOverlay(overlay);
      closer.onclick = function() {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
      };
  
      map.on('singleclick', function(event) {
        if (map.hasFeatureAtPixel(event.pixel) === true) { // se esiste un marker
          map.forEachFeatureAtPixel(event.pixel, (feature, layer) => { // lo recupera
            const coordinate = event.coordinate; // ne prende le coordinate
            content.innerHTML = feature.name; // cambia il testo del popup
            overlay.setPosition(coordinate); // e lo sposta sopra il marker
          })
        } else {
          overlay.setPosition(undefined); // altrimenti lo nasconde
          closer.blur();
        }
      });
  
    }
  
    // create map
    const map = new ol.Map({ target: document.querySelector('.map') });
    setLayers(map);
    setCenter(map, [long_b, lat_b]);
    setZoom(map, 13.5);
    array.forEach((element)=>{
      let coordi = { lonlat: [element.coordinate.latitudine, element.coordinate.longitudine], name: element.nome }
      addMarker(map, coordi);
    })
  
    map.on('click', function (e) {
      const feature = map.getFeaturesAtPixel(e.pixel);
      if (feature.length != 0) {
        array.forEach((element)=>{
          if (element.nome==feature[0].name){
            let address = "https://nuzzacigianluca.github.io/bologna/project/detail.html?poi=0";
            let url = new URL(String(address));
            url.searchParams.set('poi', element.id)
            console.log(url.href);
            location.href = url.href;
            Cookies.set('back','user.html');
          }
        })
      }
    })
    initOverlay(map);
  
  }
  
  
  
  const listTemplate = `
  <div id="divListView" class="poi-content">
    
  </div>`;
  
  const mapTemplate = `
  <div class="map" id="divMapView">
    <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content">
        mappa
      </div>
    </div>
  </div>
  `
  const contentView = document.getElementById("content-view");
  
  const buttonListView = document.getElementById("buttonListView");
  const buttonMapView = document.getElementById("buttonMapView");
  
  contentView.innerHTML = listTemplate;
  
  buttonListView.onclick = () => {
    contentView.innerHTML = listTemplate;
    renderTable(array);
  }
  
  buttonMapView.onclick = () => {
    contentView.innerHTML = mapTemplate;
    mapFunction();
  }
  
  
  
  get();
  
  
  
  //logout
  const logoutButton = document.getElementById("log-out");
  logoutButton.onclick = () => {
    Cookies.set('logged-user','false');
    window.location.href = "login.html";
  }
}


const logged =  Cookies.get('logged-user');
console.log(logged);

if(logged=="true"){
  main();
}else{
  document.getElementById("main").innerHTML = `
  <h2 style="text-align: center; margin-top: 30px;">NON SEI LOGGATO</h2>`
};

