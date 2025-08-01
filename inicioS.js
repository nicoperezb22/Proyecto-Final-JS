const nombreInput = document.getElementById("usuario");
const claveInput = document.getElementById("clave");
const botonLogin = document.getElementById("btn-login");
const mensaje = document.getElementById("mensaje");

const seccionLogin = document.getElementById("login-section");
const seccionHomebanking = document.getElementById("homebanking-section");

const nombreUsuarioSpan = document.getElementById("nombre-usuario");
const saldoSpan = document.getElementById("saldo");
const cbuSpan = document.getElementById("cbu");
const aliasSpan = document.getElementById("alias");

const btnTransferir = document.getElementById("btn-transferir");
const btnRetirar = document.getElementById("btn-retirar");
const btnLogout = document.getElementById("btn-logout");

const formTransferir = document.getElementById("transferir-form");
const formRetirar = document.getElementById("retirar-form");

const inputDestinatario = document.getElementById("input-destinatario");
const inputMontoTransferir = document.getElementById("input-monto-transferir");
const inputMontoRetirar = document.getElementById("input-monto-retirar");

const confirmarTransferir = document.getElementById("confirmar-transferir");
const cancelarTransferir = document.getElementById("cancelar-transferir");

const confirmarRetirar = document.getElementById("confirmar-retirar");
const cancelarRetirar = document.getElementById("cancelar-retirar");

const listaMovimientos = document.getElementById("lista-movimientos");

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

function ocultar(el) {
  el.classList.add("hidden");
}

function mostrar(el) {
  el.classList.remove("hidden");
}

function guardarUsuarios() {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function mostrarMovimientos(movs = []) {
  listaMovimientos.innerHTML = "";
  movs.forEach((mov) => {
    const li = document.createElement("li");
    li.textContent = mov;
    listaMovimientos.appendChild(li);
  });
}

function actualizarVista(usuario) {
  nombreUsuarioSpan.textContent = usuario.nombre;
  saldoSpan.textContent = usuario.saldo;
  cbuSpan.textContent = usuario.cbu;
  aliasSpan.textContent = usuario.alias || "-";
  mostrarMovimientos(usuario.movimientos || []);
}

function generarDatosDesdeJSON(func) {
  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      const info = data[0];
      const indice = Math.floor(Math.random() * info.cbu.length);
      const nuevoUsuario = {
        cbu: info.cbu[indice],
        alias: info.alias[indice],
        saldo: info.saldo[indice],
        movimientos: []
      };
      func(nuevoUsuario);
    });
}

botonLogin.addEventListener("click", () => {
  const nombre = nombreInput.value.trim();
  const clave = claveInput.value.trim();
  mensaje.textContent = "";

  if (!nombre || !clave) {
    mensaje.textContent = "Completá todos los campos.";
    return;
  }

  let encontrado = usuarios.find(u => u.nombre === nombre && u.clave === clave);

  if (!encontrado) {
    
    generarDatosDesdeJSON((datos) => {
      const nuevo = {
        nombre,
        clave,
        ...datos
      };
      usuarios.push(nuevo);
      guardarUsuarios();
      Swal.fire("¡Registrado!", "Usuario creado exitosamente", "success");
      mostrar(seccionHomebanking);
      ocultar(seccionLogin);
      actualizarVista(nuevo);
    });
  } else {
    Swal.fire("¡Bienvenido!", "Inicio de sesión exitoso", "success");
    mostrar(seccionHomebanking);
    ocultar(seccionLogin);
    actualizarVista(encontrado);
  }
});

btnTransferir.addEventListener("click", () => {
  mostrar(formTransferir);
  ocultar(formRetirar);
});

btnRetirar.addEventListener("click", () => {
  mostrar(formRetirar);
  ocultar(formTransferir);
});

cancelarTransferir.addEventListener("click", () => {
  ocultar(formTransferir);
});

cancelarRetirar.addEventListener("click", () => {
  ocultar(formRetirar);
});

confirmarTransferir.addEventListener("click", () => {
  const monto = parseFloat(inputMontoTransferir.value);
  const destinatario = inputDestinatario.value.trim();
  const nombre = nombreUsuarioSpan.textContent;

  let usuario = usuarios.find(u => u.nombre === nombre);

  if (isNaN(monto) || monto <= 0 || !destinatario) {
    Swal.fire("Error", "Datos inválidos", "error");
    return;
  }

  if (usuario.saldo < monto) {
    Swal.fire("Sin saldo", "No tenés plata suficiente", "error");
    return;
  }

  usuario.saldo -= monto;
  const mov = `Transferiste $${monto} a ${destinatario}`;
  usuario.movimientos.push(mov);

  guardarUsuarios();
  actualizarVista(usuario);
  Swal.fire("Listo", "Transferencia hecha", "success");

  inputMontoTransferir.value = "";
  inputDestinatario.value = "";
  ocultar(formTransferir);
});

confirmarRetirar.addEventListener("click", () => {
  const monto = parseFloat(inputMontoRetirar.value);
  const nombre = nombreUsuarioSpan.textContent;

  let usuario = usuarios.find(u => u.nombre === nombre);

  if (isNaN(monto) || monto <= 0) {
    Swal.fire("Error", "Poné un monto válido", "error");
    return;
  }

  if (usuario.saldo < monto) {
    Swal.fire("Sin saldo", "No alcanza para retirar", "error");
    return;
  }

  usuario.saldo -= monto;
  const mov = `Retiraste $${monto}`;
  usuario.movimientos.push(mov);

  guardarUsuarios();
  actualizarVista(usuario);
  Swal.fire("Listo", "Retiro exitoso", "success");

  inputMontoRetirar.value = "";
  ocultar(formRetirar);
});

btnLogout.addEventListener("click", () => {
  location.reload();
});
