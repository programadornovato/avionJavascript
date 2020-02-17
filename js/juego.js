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
