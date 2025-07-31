const dinero = document.querySelector("#saldo");
const cbu = document.querySelector("#CBU");




fetch("data.json")
.then(res=>res.json())
.then(data=>{
    let info = data[0]
    let randomInd = Math.floor(Math.random()* info.cbu.length)
    let randomS = Math.floor(Math.random()* info.saldo.length)
    
    dinero.textContent = info.saldo[randomS]
    cbu.textContent += info.cbu[randomInd]
})

