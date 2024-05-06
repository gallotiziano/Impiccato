

const main = () => {


  const token = "839ab0d3-070b-4298-8e8e-62bed11c7adb";
  const chiave = "progetto-poi";
  const urlSet = "https://ws.progettimolinari.it/cache/set";
  const urlGet = "https://ws.progettimolinari.it/cache/get";

  const addImage = document.getElementById("add-image");
  const divInput = document.getElementById("input-images-box");

  const inputTemplate = `
  <input type="text" class="form-control imageInput hidden editImage" id="name-input%n,%id" aria-describedby="emailHelp" placeholder="Enter image url" value="%value">`


  const clearValues = () => {
    document.getElementById("name-input").value = "";
    document.getElementById("description-input").value = "";
    document.getElementById("lon-input").value = "";
    document.getElementById("lat-input").value = "";
  }

  const addPoiButton = document.getElementById("add-poi");

  addPoiButton.onclick = () => {
    clearValues();
    let html = ""
    for (let i = 0; i < 10; i++) {
      html += inputTemplate.replace("%n", String(i + 1)).replace("%value","").replace(",%id","").replace("editImage","");
    }
    divInput.innerHTML = html;
    document.querySelector("#name-input1").classList.remove("hidden");
  }


  //max 10 images
  let imagesAdded = 1;
  addImage.onclick = () => {
    if (imagesAdded < 10) {
      document.querySelector("#name-input" + String(imagesAdded + 1)).classList.remove("hidden");
      imagesAdded += 1;
    }
  }



  const save = (array) => {
    fetch(urlSet, {
      headers: {
        "Content-Type": "application/json",
        key: token
      },
      method: "POST",
      body: JSON.stringify({
        key: chiave,
        value: array
      })
    })
      .then((r) => r.json())
      .then((r) => {
        console.log("Risposta: " + r.result);
        renderTable(array);
      })
      .catch((r) => {
        console.log("Risposta: " + r.result);
      });
  };


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
        clickSave(r.result,document.getElementById("save-button"));
        renderTable(r.result);
      })
  }


  const saveButton = document.getElementById("save-button");
  const clickSave = (array) => {
    saveButton.onclick = () => {
      const nameInput = document.getElementById("name-input");
      const descrInput = document.getElementById("description-input");
      const imagesInputs = [].slice.apply(document.querySelectorAll(".imageInput"));
      const lonInput = document.getElementById("lon-input");
      const latInput = document.getElementById("lat-input");

      const nameValue = nameInput.value;
      const descrValue = descrInput.value;
      const imagesUrl = imagesInputs.map(input => input.value);
      const lonValue = lonInput.value;
      const latValue = latInput.value;

      const id = Date.now();

      const poi = {
        id: id,
        nome: nameValue,
        descrizione: descrValue,
        immagine: imagesUrl,
        coordinate: {
          longitudine: lonValue,
          latitudine: latValue
        },
      };
      array.push(poi);
      save(array);
    }
  }


  get();






  //vista

  const divContentPoi = document.getElementById("poi-content");

  const divPoiTemplate = `
  <div class="poi" id="%id">
        <div class="external-poi">
          <div class="image-poi">
            <img src="%linkimage">
          </div>
          <div class="bottom-poi">
            <div class="nome">%nome</div>
            <div class="buttons-poi">
              <button type="button" class="btn edit-button" id="edit%id" data-toggle="modal" data-target="#modalEdit%id">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
              </button>
              <button type="button" class="btn trash-button" id="trash%id" data-toggle="modal" data-target="#modalDelete%id">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash"
                  viewBox="0 0 16 16">
                  <path
                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                  <path
                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Modal -->
        <div class="modal fade" id="modalEdit%id" tabindex="-1" role="dialog"
          aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Edit Point of Interest</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form>
                  <div class="form-group">
                    <label for="name-input%id">Name</label>
                    <input type="text" class="form-control" id="name-input%id" placeholder="Enter name">
                  </div>
                  <div class="form-group">
                    <label for="description-input%id">Description</label>
                    <textarea type="text" class="form-control" id="description-input%id"
                      placeholder="Add description"></textarea>
                  </div>
                  <div class="form-group">
                    <label for="image-input%id">Images</label>
                    <div id="input-images-box%id">
      
                    </div>
                    <button id="add-image%id" class="btn btn-light" type="button">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg"
                        viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                          d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                      </svg>
                    </button>
                    <small id="" class="form-text text-muted">Max 10 images</small>
                  </div>
                  <div class="row">
                    <label for="coord-box%id">Coordinates</label>
                    <div class="col" id="coord-box%id">
                      <label for="lon-input%id">Longitude</label>
                      <input type="text" class="form-control" id="lon-input%id" placeholder="Add longitude">
                    </div>
                    <div class="col">
                      <label for="lat-input%id">Latitude</label>
                      <input type="text" class="form-control" id="lat-input%id" placeholder="Add latitude">
                    </div>
                  </div>
      
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal" id="save-button%id">Edit</button>
              </div>
            </div>
          </div>
        </div>
            
        <!-- Modal -->
        <div class="modal fade" id="modalDelete%id" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Elimina POI</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                Sei sicuro di voler eliminare il Point Of Interest?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Annulla</button>
                <button type="button" class="btn btn-danger delete-button" id="button%id" data-dismiss="modal">Elimina POI</button>
              </div>
            </div>
          </div>
        </div>
      
      </div>`;


  const renderTable = (array) => {
    //render tabelle e tutto
    
    divContentPoi.innerHTML = "";
    if(array.length==0){
      divContentPoi.innerHTML = "Non ci sono ancora POI"
    }
    array.forEach((poi) => {
      divContentPoi.innerHTML += divPoiTemplate.replaceAll("%id",poi.id).replace("%linkimage",poi.immagine[0]).replace("%nome",poi.nome);
    })
    //delete buttons
    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach((button) => {
      button.onclick = () => {
        const deleteButtonId = button.id.replace("button","");
        array.forEach((poi)=>{
          if(poi.id==deleteButtonId){
            array.splice(array.indexOf(poi),1);
            save(array);
          };
        });
      };
    });

    //edit buttons
    const editButtons = document.querySelectorAll(".edit-button");
    editButtons.forEach((button) =>{
      button.onclick = () => {
        const editButtonsId = button.id.replace("edit","");
        clearValues();
        array.forEach((poi)=>{
          if(poi.id==editButtonsId){
            document.getElementById("name-input"+editButtonsId).value=poi.nome;
            document.getElementById("description-input"+editButtonsId).value=poi.descrizione;
            document.getElementById("lon-input"+editButtonsId).value=poi.coordinate.longitudine;
            document.getElementById("lat-input"+editButtonsId).value=poi.coordinate.latitudine;
            document.getElementById("input-images-box"+editButtonsId).innerHTML = "";
            let htmlEditImage = "";
            let imagesEditAdded = 0;
            //aggiungo tutti
            poi.immagine.forEach((image)=>{
              imagesEditAdded+=1;
              htmlEditImage += inputTemplate.replace("%value",image).replace("hidden","").replace("%n",String(imagesEditAdded)).replace("%id",editButtonsId);
            })
            document.getElementById("input-images-box"+editButtonsId).innerHTML = htmlEditImage;
            //lascio solo quelli con il valore
            for(let i = 0; i<10; i++){
              if(poi.immagine[i]==""){
                document.getElementById("name-input"+String(i+1)+","+editButtonsId).classList.add("hidden");
                imagesEditAdded-=1;
              }
            }

            const addImageButton = document.getElementById("add-image"+editButtonsId);
            addImageButton.onclick = () => {
              if (imagesEditAdded < 10) {
                imagesEditAdded+=1;
                document.getElementById("name-input"+String(imagesEditAdded)+","+editButtonsId).classList.remove("hidden");
              }
            }
          }
        })
        const saveButtonEdit = document.getElementById("save-button"+editButtonsId);
        saveButtonEdit.onclick=() =>{
          array.forEach((poi)=>{
            if(poi.id==editButtonsId){
              array[array.indexOf(poi)].nome=document.getElementById("name-input"+editButtonsId).value;
              array[array.indexOf(poi)].descrizione=document.getElementById("description-input"+editButtonsId).value;
              array[array.indexOf(poi)].coordinate.longitudine=document.getElementById("lon-input"+editButtonsId).value;
              array[array.indexOf(poi)].coordinate.latitudine=document.getElementById("lat-input"+editButtonsId).value;

              const editImagesInputs = [].slice.apply(document.querySelectorAll(".editImage"));
              const editImagesUrl = editImagesInputs.map(input => input.value);
              array[array.indexOf(poi)].immagine = editImagesUrl;
              
              save(array);
            }
          })
          
        }
        
      }
    })
    


  }


  //logout
  const logoutButton = document.getElementById("log-out");
  logoutButton.onclick = () => {
    Cookies.set('logged-admin','false');
    window.location.href = "login.html";
  }
}


const logged = Cookies.get('logged-admin');
console.log(logged);
if(logged=="true"){
  main();
}else{
  document.getElementById("main").innerHTML = `
  <h2 style="text-align: center; margin-top: 30px;">NON SEI LOGGATO</h2>`
}
