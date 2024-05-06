Cookies.set('logged-admin','false');
Cookies.set('logged-user','false');



const show =`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 18 18">
  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"></path>
  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"></path>
</svg>`;

const hide = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
              <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588M5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"></path>
              <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"></path>
            </svg>`;


const token = "839ab0d3-070b-4298-8e8e-62bed11c7adb";

const show_hide = document.getElementById("show-hide-box");
const username_input = document.getElementById("username-input");
const password_input = document.getElementById("password-input");
//username
const login = document.getElementById("login-button");

const urlGet = "https://ws.progettimolinari.it/credential/login";
const wrong=document.getElementById("wrong")
wrong.style.visibility = "hidden";

const check = (us,pw) =>{
  fetch(urlGet, {
    headers: {
      "Content-type": "application/json",
      key: token
    },
    method: "POST",
    body: JSON.stringify({
      username: us,
      password: pw
    })
  }).then((r) => r.json())
  .then((r) => {
    const result = r.result;
    //open admin/user page
    if(result==true){
      
      if(us=="admin"){
        window.location.href = "admin.html";
        Cookies.set('logged-admin','true');
      }else if(us=="user"){
        window.location.href = "user.html";
        Cookies.set('logged-user','true');
      }
    }else{
       wrong.style.visibility = "visible";
    }
    
    
  })
  .catch((r) => {
    console.log("Risposta: " + r.result);
  });
}

//show/hide password
show_hide.onclick = () => {
 if(show_hide.innerHTML == hide){
   show_hide.innerHTML = show;
   password_input.type="text";
 }else{
   show_hide.innerHTML = hide;
    password_input.type="password";
  };
}



login.onclick = () => {
  if(password_input.value!="" || username_input.value!=""){
    check(username_input.value,password_input.value)
  }else{
    wrong.style.visibility = "visible";
  }
};

username_input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    console.log("clicked")
    event.preventDefault();
    login.click();
  }
});

password_input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    console.log("clicked")
    event.preventDefault();
    login.click();
  }
});

