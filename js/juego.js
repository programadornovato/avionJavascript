//alert("hola desde javascript");
var mapa = document.getElementById('mapa');
var anchoMapa = mapa.clientWidth;
var altoMapa = mapa.clientHeight;

var canvas = document.createElement('canvas');
canvas.width = anchoMapa;
canvas.height = altoMapa;

var matriz=[];
var contador=0;
var verPais=false;
window.onload = function (event) {
    canvas.getContext('2d').drawImage(mapa, 0, 0, anchoMapa, this.altoMapa);
    document.body.appendChild(canvas);
    canvas.setAttribute('id', 'canvas');
    buscaPais();
    do{
        var xy=buscaPais();
        if(xy==null){
            location.reload();
            break;
        }else{
            llenarUnPais(xy['posAleatoriaMapaX'],xy['posAleatoriaMapaY']);
        }
    }
    while(contador<800);
}
function llenarUnPais(x,y) {
    contador=0;
    llenarArea(x,y,1);
    llenarArea(x,y,-1);
    llenarTodo();
}
function buscaPais(){
    var con=0;
    do{
        var posAleatoriaMapaX=numeroAleatorio(anchoMapa);
        var posAleatoriaMapaY=numeroAleatorio(altoMapa);
        var datosDelPixel=canvas.getContext('2d').getImageData(posAleatoriaMapaX,posAleatoriaMapaY,1,1).data;
        //var ctx=canvas.getContext('2d');
        //ctx.fillStyle='rgb(0, 102, 0)';
        //ctx.fillRect(posAleatoriaMapaX,posAleatoriaMapaY,8,8);
        con++;
        if(con>50)return null;
    }while(datosDelPixel[0]!=255 && datosDelPixel[1]!=255 && datosDelPixel[2]!=255);
    return {posAleatoriaMapaX,posAleatoriaMapaY};
}
function llenarArea(x, y,haciaArribaAbajo) {
    var posx = x;
    var posy = y;
    var datosDelPixel = canvas.getContext('2d').getImageData(posx, posy, 1, 1).data;
    var haciaDerechaIzquierda=1;
    var perdida=15;
    while (datosDelPixel[0] == 255 && datosDelPixel[1] == 255 && datosDelPixel[2] == 255) {
        while (datosDelPixel[0] == 255 && datosDelPixel[1] == 255 && datosDelPixel[2] == 255) {
            datosDelPixel = canvas.getContext('2d').getImageData(posx, posy, 1, 1).data;
            posx = posx + haciaDerechaIzquierda;
            matriz[contador]={posx,posy};
            contador++;
        }
        posy=posy+haciaArribaAbajo;
        haciaDerechaIzquierda=haciaDerechaIzquierda*-1;
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
function numeroAleatorio(limiteMax){
    return Math.floor(Math.random()*limiteMax);
}

canvas.addEventListener('click',function (event) {
    var encontrado=false;
    for (let i = 0; i < contador; i++) {
        if(
            (matriz[i]['posx']==event.offsetX && matriz[i]['posy']==event.offsetY) ||
            (matriz[i]['posx']==event.offsetX && matriz[i]['posy']==event.offsetY+1) ||
            (matriz[i]['posx']==event.offsetX && matriz[i]['posy']==event.offsetY-1)
        ){
            encontrado=true;
            break;
        }
    }
    if(encontrado==true){
        var respuesta=confirm("Felicidades has vendido el avion presidencia!!!¿Desear jugar otra partida?");
        if(respuesta==true){
            location.reload();
        }
    }
    else{
        console.log('Nop aqui no queremos un avion tan lujosos');
    }
})