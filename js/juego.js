//alert("hola desde javascript");
var mapa=document.getElementById('mapa');
var anchoMapa=mapa.clientWidth;
var altoMapa=mapa.clientHeight;

var canvas=document.createElement('canvas');
canvas.width=anchoMapa;
canvas.height=altoMapa;

window.onload=function (event) {
    canvas.getContext('2d').drawImage(mapa,0,0,anchoMapa,this.altoMapa);
    document.body.appendChild(canvas);
    canvas.setAttribute('id','canvas');
}
document.addEventListener('mousemove',function (event) {
    var datosDelPixel=canvas.getContext('2d').getImageData(event.offsetX,event.offsetY,1,1).data;
    document.getElementById('salida').innerHTML=`ROJO=${datosDelPixel[0]} VERDE=${datosDelPixel[1]} AZUL=${datosDelPixel[2]} ALFA=${datosDelPixel[3]} `
});
document.addEventListener('click',function (event) {
    llenarArea(event.offsetX,event.offsetY);
});
function llenarArea(x,y){
    var posx=x;
    var posy=y;
    var ctx=canvas.getContext('2d');
    ctx.fillStyle="rgb(255, 0, 0)";
    ctx.fillRect(posx,posy,6,6);
}