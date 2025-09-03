// alert("hola")

function sumar() {
    a=document.getElementById("a").value
    console.log(a)
    b=document.getElementById("b").value
    console.log(b)

    resultado=parseInt(a)+parseInt(b)
    console.log(resultado)

    document.getElementById("result").innerHTML=resultado
}