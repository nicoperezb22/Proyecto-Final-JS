const usuario = document.querySelector("#usuario");
const clave = document.querySelector("#clave");
const boton = document.querySelector("button");
const mensaje = document.querySelector("#mensaje");
const registrado = document.querySelector("#registrado");
const homebanking = document.getElementById("homebanking");
const inicioS = document.querySelector(".wrapper");

let usuarioArr = [];

boton.addEventListener("click", (e) => {
  e.preventDefault();

  mensaje.textContent = "";
  registrado.textContent = ""

  let nombreDni = usuario.value;
  let clavekey = clave.value;

  if (isNaN(clavekey)) {
  clave.value = "";
  clave.setAttribute("placeholder", "ingresa solo números");
  clave.style.border = "1px solid red"; // o lo que uses como borde normal

  return;
}


  if (nombreDni === "" || clavekey === "") {
    mensaje.textContent = "rellenar campo";
    mensaje.style.color = "red";
    return;
  }

  if (usuarioArr.some((user) => user.nombre === nombreDni)) {
    registrado.textContent = "usuario ya registrado"
    return;
  }

  if (nombreDni !== "" && clavekey !== "") {
    let usuarioOBJ = {
      nombre: nombreDni,
      clave: clavekey,
    };
    usuarioArr.push(usuarioOBJ);
    localStorage.setItem("usuario", JSON.stringify(usuarioArr));
    
    setTimeout(()=>{
      inicioS.classList.add("display-none")   
      homebanking.classList.remove("display-none")
    },2000)

  }
});



// localStorage.removeItem("usuario")
