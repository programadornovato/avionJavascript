//alert("hola desde javascript");
var mapa = document.getElementById('mapa');
var anchoMapa = mapa.clientWidth;
var altoMapa = mapa.clientHeight;

var canvas = document.createElement('canvas');
canvas.width = anchoMapa;
canvas.height = altoMapa;

var matriz=[];
var contador=0;
var verPais=true;
window.onload = function (event) {
    canvas.getContext('2d').drawImage(mapa, 0, 0, anchoMapa, this.altoMapa);
    document.body.appendChild(canvas);
    canvas.setAttribute('id', 'canvas');
}
document.addEventListener('mousemove', function (event) {
    var datosDelPixel = canvas.getContext('2d').getImageData(event.offsetX, event.offsetY, 1, 1).data;
    document.getElementById('salida').innerHTML = `ROJO=${datosDelPixel[0]} VERDE=${datosDelPixel[1]} AZUL=${datosDelPixel[2]} ALFA=${datosDelPixel[3]} `
});
document.addEventListener('click', function (event) {
    llenarArea(event.offsetX, event.offsetY,1);
    llenarArea(event.offsetX, event.offsetY,-1);
    llenarTodo();
});
function llenarArea(x, y,haciaArribaAbajo) {
    /*
    var ctx=canvas.getContext('2d');
    ctx.fillStyle="rgb(255, 0, 0)";
    ctx.fillRect(posx,posy,6,6);
    */
    var posx = x;
    var posy = y;
    var datosDelPixel = canvas.getContext('2d').getImageData(posx, posy, 1, 1).data;
    var haciaDerechaIzquierda=1;
    var perdida=15;
    while (datosDelPixel[0] == 255 && datosDelPixel[1] == 255 && datosDelPixel[2] == 255) {
        while (datosDelPixel[0] == 255 && datosDelPixel[1] == 255 && datosDelPixel[2] == 255) {
            datosDelPixel = canvas.getContext('2d').getImageData(posx, posy, 1, 1).data;
            /*
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = "rgb(255, 0, 0)";
            ctx.fillRect(posx, posy, 1, 1);
            */
            posx = posx + haciaDerechaIzquierda;
            matriz[contador]={posx,posy};
            contador++;
        }
        posy=posy+haciaArribaAbajo;
        haciaDerechaIzquierda=haciaDerechaIzquierda*-1;
        //posx=posx+(perdida*haciaDerechaIzquierda);
        for (let i = 0; i < perdida; i++) {
            posx=posx+haciaDerechaIzquierda;
            matriz[contador]={posx,posy};
            contador++;
        }
        datosDelPixel = canvas.getContext('2d').getImageData(posx, posy, 1, 1).data;
    }
}
function llenarTodo() {
    for (let i = 0; i < contador; i++) {
        if(verPais==true){
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = "rgb(0, 0, 204)";
            ctx.fillRect(matriz[i]['posx'],matriz[i]['posy'],1,1);
        }
    }
}