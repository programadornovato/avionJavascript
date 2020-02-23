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

var numFallos=0;
var limiteFallos=5;
var xy=null;
var oportunidadesRestantes=limiteFallos-numFallos;
window.onload = function (event) {
    var ctx=canvas.getContext('2d');
    ctx.drawImage(mapa, 0, 0, anchoMapa, this.altoMapa);
    document.body.appendChild(canvas);
    canvas.setAttribute('id', 'canvas');
    ctx.fillStyle="red";
    ctx.font="20px Arial";
    ctx.fillText(`Oportunidades ${oportunidadesRestantes}`,10,500);
    buscaPais();
    do{
        xy=buscaPais();
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
    if(verPais==true){
        llenarTodo();
    }
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
        
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = "rgb(0, 0, 204)";
            ctx.fillRect(matriz[i]['posx'],matriz[i]['posy'],1,1);
    }
}
function numeroAleatorio(limiteMax){
    return Math.floor(Math.random()*limiteMax);
}

canvas.addEventListener('click',clickCanvas);
function clickCanvas (event) {
    var encontrado=false;
    var avion=document.getElementById('avion');
    var fuego=document.getElementById('fuego');

    var no=document.getElementById('no');
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
        avion.style.display="inline";
        fuego.style.display="inline";

        mueveElemento(event.offsetX,event.offsetY,avion);
        mueveElemento(event.offsetX,event.offsetY,fuego);
        var jet=new Audio('audio/jet.mp3');
        jet.play();
        var tiempoEspera=setInterval(function(){
            var respuesta=confirm("Felicidades has vendido el avion presidencia!!!¿Desear jugar otra partida?");
            if(respuesta==true){
                location.reload();
            }
            clearInterval(tiempoEspera);
        },3000);
    }
    else{
        //console.log('Nop aqui no queremos un avion tan lujosos');
        var pierde=new Audio('audio/pierde.mp3');
        pierde.play();
        no.style.display="inline";
        mueveElemento(event.offsetX,event.offsetY,no);
        var ctx=canvas.getContext('2d');
        ctx.fillStyle="blue";
        ctx.clearRect(10,480,230,50);
        ctx.fillStyle="red";
        ctx.font="20px Arial";
        numFallos++;
        oportunidadesRestantes=limiteFallos-numFallos;
        ctx.fillText(`Oportunidades ${oportunidadesRestantes}`,10,500);
        var distancia=distanciaEntrePuntos(event,xy);
        var mensaje=muestraDistancia(distancia);
        ctx.fillText(mensaje,10,520);
        if(oportunidadesRestantes<0){
            document.getElementById('llora').style.display='inline';
            ctx.clearRect(10,480,230,50);
            ctx.fillText(`Oportunidades 0`,10,500);
            ctx.fillText(mensaje,10,520);
            canvas.removeEventListener('click',clickCanvas);
            llenarTodo();
            var tiempoEspera=setInterval(function(){
                var respuesta=confirm("Lo siento no pudiste vender el avion presidencia!!!¿Desear jugar otra partida?");
                if(respuesta==true){
                    location.reload();
                }
                clearInterval(tiempoEspera);
            },2000);

        }
    }
}
function mueveElemento(x,y,elemento) {
    var contenedor=document.getElementsByTagName('body')[0];
    var xPosicion=x-contenedor.getBoundingClientRect().left-(elemento.clientWidth/2);
    var yPosicion=y-contenedor.getBoundingClientRect().top-(elemento.clientHeight/2);
    elemento.style.left=xPosicion+"px";
    elemento.style.top=yPosicion+"px";
}

function distanciaEntrePuntos(event,xy){
    var difX=event.offsetX-xy['posAleatoriaMapaX'];
    var difY=event.offsetY-xy['posAleatoriaMapaY'];
    var distancia=Math.sqrt(Math.pow(difX,2)+Math.pow(difY,2));
    return distancia;
}
function muestraDistancia(distancia){
    if(distancia<100){
        return "Casi te quemas";
    }
    else if(distancia<200){
        return "Muy caliente";
    }
    else if(distancia<300){
        return "Caliente";
    }
    else if(distancia<400){
        return "Templado";
    }
    else if(distancia<600){
        return "Frio";
    }
    else if(distancia<800){
        return "Muy Frio";
    }
    else{
        return "congelado";
    }

}
