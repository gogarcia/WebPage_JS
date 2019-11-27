//Evento que se dispara al inicio
window.addEventListener('load', inicio, false);


// ** OBJETOS  Y VARIABLES *****************************************************************
var imagenSelecionada = new Image(); //imagen selecionada para formar el puzzle

var cvPiezas;  //canvas de las piezas
var ctxPiezas; //contexto del canvas piezas

var cvPuzzle; //canvas del puzzle
var ctxPuzzle; //contexto del canvas puzzle

var imgDataArrayOrd = new Array(); //array de imageData con 48 elementos de 60x60px
var imgDataArrayDes = new Array(); //igual que imgDataArrayOrd pero desordenado (random)

// array de objetos miPieza con la info de cada pieza
var miArrayDisponibles = new Array(); 

// array de objetos miPieza colocados en el puzzle con toda la info
var miArrayPuzzle = new Array(); 

//array con los (cont) de las piezas que estan mal colocadas
var contMalColocadas;

//posicion del raton al clicar en el CANVAS PIEZAS de 'x' y de 'y'
var mouseXpiezas, mouseYpiezas; 

//posicion del raton al hacer over en el CANVAS Puzzle de 'x' y de 'y'
var mouseXpuzzle, mouseYpuzzle; 

//posicion del raton al clicar en el CANVAS PUZZLE de 'x' y de 'y'
var mouseXpuzzle, mouseYpuzzle;

var piezaActualPiezas; //pieza que selecciono en el CANVAS PIEZAS

var piezaActualPuzzle; //casilla que sellecciono en el CANVAS PUZZLE

var contadorMovimientos;  //contador de movimientos del Puzzle

var textoPopUp; //Valor de la etiqueta span del popUp

var worker = new Worker('workers/worker.js'); // Se crea el worker


//objeto de tipo ImageData donde guardo todos los valores de la imagen original
var imageDataOriginal;

//objeto de tipo ImageData donde guardo todos los valores de la imagen actual al comprobar
var imageDataPuzzle;

//canvas empleado unicamente para coger la pieza y luego hacer el drag
var cvUnica;


var ilength = 6;
var jlength = 4;
var length = 60;

var nohayimagen = true;

// ** OBJETOS  Y VARIABLES *****************************************************************





// Para el reloj

var centesimas = 0;
var segundos = 0;
var minutos = 0;
var horas = 0;
var control;



function reinicio () {
  control = setInterval(cronometro,10);
  clearInterval(control);
  centesimas = 0;
  segundos = 0;
  minutos = 0;
  horas = 0;
  Centesimas.innerHTML = ":00";
  Segundos.innerHTML = ":00";
  Minutos.innerHTML = ":00";
  Horas.innerHTML = "00";
}

function parar () {
  window.clearInterval(control);
  //console.log("Holiii, llegas a entrar aqui o que?");
}

function cronometro () {
  if (centesimas < 99) {
    centesimas++;
    if (centesimas < 10) { centesimas = "0"+centesimas }
    Centesimas.innerHTML = ":"+centesimas;
  }
  if (centesimas == 99) {
    centesimas = -1;
  }
  if (centesimas == 0) {
    segundos ++;
    if (segundos < 10) { segundos = "0"+segundos }
    Segundos.innerHTML = ":"+segundos;
  }
  if (segundos == 59) {
    segundos = -1;
  }
  if ( (centesimas == 0)&&(segundos == 0) ) {
    minutos++;
    if (minutos < 10) { minutos = "0"+minutos }
    Minutos.innerHTML = ":"+minutos;
  }
  if (minutos == 59) {
    minutos = -1;
  }
  if ( (centesimas == 0)&&(segundos == 0)&&(minutos == 0) ) {
    horas ++;
    if (horas < 10) { horas = "0"+horas }
    Horas.innerHTML = horas;
  }
}







//FUNCION CONSTRUCTOR DE LAS PIEZAS
function miPieza(cont, canvas, context, imgData, posX, posY, selec, ocupada){

    // VARIABLES
    this.cont = cont;
    this.canvas = canvas;
    this.context = context;
    this.imgData = imgData;
    this.posX = posX;
    this.posY = posY;
    this.selec = selec;
    this.ocupada = ocupada;
    
    // METODOS
    // metodo que devuelve la posicion
    this.getCont = function(){ 
        return this.cont;
    }

    this.getCanvas = function(){ 
        return this.canvas;
    }
    
    // metodo que devuelve el contexto del canvas
    this.getContext = function(){
        return this.context;
    }

    // metodo que devuelve el objeto imageData
    this.getImgData = function(){
        return this.imgData;
    }
    
    // metodo que devuelve la posicion en X de la pieza en el canvas
    this.getPosX = function(){
        return this.posX;
    }

    // metodo que devuelve la posicion en Y de la pieza en el canvas
    this.getPosY = function(){
        return this.posY;
    }
    
    // metodo que devuelve si la pieza esta seleccionada o no
    this.getSelec = function(){
        return this.selec;
    }

    // metodo que devuelve si la pieza esta ocupada o no
    this.getOcupada = function(){
        return this.ocupada;
    }

    //seteo la variable cont
    this.setCont = function(val){ 
        this.cont = val;
    }

    //seteo la variable canvas
    this.setCanvas = function(val){ 
        this.canvas = val;
    }
    
    //seteo la variable context
    this.setContext = function(val){
        this.context = val;
    }

    //seteo la variable imgData
    this.setImgData = function(val){
        this.imgData = val;
    }
    
    //seteo la variable posX
    this.setPosX = function(val){
        this.posX = val;
    }

    //seteo la variable posY
    this.setPosY = function(val){
        this.posY = val;
    }

    //seteo la variable selec
    this.setSelec = function(){
      if(this.selec == true){
        this.selec = false;
      }
      else{
        this.selec = true;
      }
    }

    //seteo la vatiable ocupada
    this.setOcupada = function(val){
        this.ocupada = val;
    }

    //para resaltar la pieza
    this.ponerContorno = function(){
      this.setSelec();

      if(this.canvas.id == "canvasPiezas"){
        this.context.strokeStyle ='#f00';
        this.context.lineWidth = 1;
        this.context.strokeRect(posX-.5,posY-.5,length+1,length+1);
      }
      else{
        this.context.strokeStyle ='#0f0';
        this.context.lineWidth = 2;
        this.context.strokeRect(posX,posY,length,length);
      }
    }

    //para dejar de resaltar la pieza
    this.quitarContorno = function(){
      this.setSelec();

      if(this.canvas.id == "canvasPiezas"){
        this.context.strokeStyle ='#fff';
        this.context.lineWidth = 1;
        this.context.strokeRect(posX-.5,posY-.5,length+1,length+1);
      }
      else{  
        iniciarCanvasPuzzle();
      }
    }

    //marca las piezas mal colocadas

    // ------------------------------------------------------ ESTO NO VEO QUE FUNCIONE
    this.marcarMalColocada = function(){
      this.context.strokeStyle ='#f00';
      this.context.lineWidth = 2;
      this.context.strokeRect(posX,posY,length,length);  
    }

    


}//FIN DEL OBJETO miPieza



//PERMITE QUE SE PUEDAN ARRASTRAR ELEMENTOS A LA <img> Y DISPARA EL EVENTO DROP CUANDO SE HACE
//INICIALIZA ALGUNOS OBJETOS
function inicio() { 
  document.getElementById('imgSelecionada').addEventListener('dragover', permitirDrop, false);    
  document.getElementById('imgSelecionada').addEventListener('drop', drop, false);

  document.getElementById('canvasPuzzle').addEventListener('dragover', permitirDrop, false);

  cvPiezas = document.getElementById("canvasPiezas");
  ctxPiezas = cvPiezas.getContext('2d');

  cvPuzzle = document.getElementById("canvasPuzzle");
  ctxPuzzle = cvPuzzle.getContext('2d');

  cvUnica = document.getElementById("canvasUnica");
  ctxUnica = cvUnica.getContext('2d');

  contadorMovimientos = document.getElementById("pMovimientos");
  textoPopUp = document.getElementById("spanPopUp");


  iniciarCanvasPuzzle();
}





// CARGA LA IMAGEN QUE SELECIONAMOS EN EL INPUT
function cargarImagen(){
   imagenSelecionada = null;

   var imagen = document.getElementById("imgSelecionada");

   var nomImagen = document.getElementById("inputSeleccionar").files[0].name;
   //console.log("holis");
   if(esUnaImagen(nomImagen)){
     // console.log(nomImagen);
      //TODO------------------------------------------------------------------------------------------------------
   		imagen.src = nomImagen;
      imagenSelecionada = imagen;

      document.getElementById('imgSelecionada').onload = function(){

        recortarImagen();

      };      
   }
   else{
      mostrarPopUp("Por favor, seleccione una imagen");
   }

}


//PARA VALIDAR SI EL ARCHIVO SELECCIONADO ES UNA IMAGEN
function esUnaImagen(nomImagen){
	if(
   		nomImagen.substring(nomImagen.length-4,nomImagen.length) == ".png" ||
   		nomImagen.substring(nomImagen.length-4,nomImagen.length) == ".PNG" ||
   		nomImagen.substring(nomImagen.length-4,nomImagen.length) == ".gif" ||
   		nomImagen.substring(nomImagen.length-4,nomImagen.length) == ".GIF" ||
   		nomImagen.substring(nomImagen.length-4,nomImagen.length) == ".jpg" ||
   		nomImagen.substring(nomImagen.length-4,nomImagen.length) == ".JPG"
   ){
   		return true;
   }
   else{
   		return false;
   }

}


//IMPRIME UN OBJEO POR CONSOLA
function imprimirObjeto(o) {
  var salida = '';
  for (var p in o) {
    salida += p + ': ' + o[p] + '\n';
  }
  //console.log(salida);
}


function drop(ev){
  ev.preventDefault();
  var arch=new FileReader();


  if(esUnaImagen(ev.dataTransfer.files[0].name)){
    arch.addEventListener('load',leer,false);
    arch.readAsDataURL(ev.dataTransfer.files[0]);





      document.getElementById("dificultad").remove();
     document.getElementById("dificultad_h2").innerHTML = "Dificultad: ";
     switch(ilength){
        case 6:
        document.getElementById("dificultad_h2").innerHTML += "Baja";
          break;
        case 9:
          document.getElementById("dificultad_h2").innerHTML += "Media";
          break;
        case 12:
          document.getElementById("dificultad_h2").innerHTML += "Alta";
          break;
     }
  }
  else{
    mostrarPopUp("Por favor, arrastre una imagen");
  }
}      
    
function permitirDrop(ev){
  ev.preventDefault();
}    
    
function leer(ev) {
 document.getElementById('imgSelecionada').onload = function(){
  imagenSelecionada =  document.getElementById('imgSelecionada');

  recortarImagen();

 };
 document.getElementById('imgSelecionada').src = ev.target.result; 
}



//RESTAURA EL CANVAS DEL PUZZLE A LA FORMA INICIAL (REJILLA)
function iniciarCanvasPuzzle(){
  cvPuzzle.width = cvPuzzle.width;

  ctxPuzzle.strokeStyle ='#000';
  ctxPuzzle.lineWidth = 1;

  var contOcupadas = 0;
  var cont = 0;
  for(i = 0; i < ilength; i++){
    for(j = 0; j < jlength; j++){

      if( miArrayPuzzle.length != ilength*jlength){ //para entrar solo la primera vez

        var miCasillaActual = new miPieza(
          cont,
          cvPuzzle,
          ctxPuzzle,
          undefined,
          length*i, 
          length*j, 
          false,
          false
        );
        miArrayPuzzle.push(miCasillaActual);

      }
       if(miArrayPuzzle[cont].getImgData() == undefined){
          ctxPuzzle.strokeRect(
           miArrayPuzzle[cont].getPosX(),
            miArrayPuzzle[cont].getPosY(),
            length,
            length);
         miArrayPuzzle[cont].setOcupada(false); 

      }
      else{
        contOcupadas++;
        ctxPuzzle.putImageData(
          miArrayPuzzle[cont].getImgData(),
          miArrayPuzzle[cont].getPosX(),
          miArrayPuzzle[cont].getPosY()
        );
         miArrayPuzzle[cont].setOcupada(true);

      }

        cont++;
    }
  }
  if(contOcupadas == ilength*jlength){
    document.getElementById('buttonComprobar').style.visibility = 'visible';
  }
  iniciarCanvasPiezas();
}

//RESTAURA EL CANVAS DEL PIEZAS A LA FORMA INICIAL
function iniciarCanvasPiezas(){
  cvPiezas.width = cvPiezas.width;

  ctxPiezas.strokeStyle ='#f00';
  ctxPiezas.lineWidth = 1;
  if(nohayimagen){
    return;
  }
  var cont = 0;
  for(i = 0; i < ilength; i++){
    for(j = 0; j < jlength; j++){

      if( miArrayDisponibles.length != ilength*jlength){ //para entrar solo la primera vez

          var miPiezaActual = new miPieza(
            cont, 
            cvPiezas, 
            ctxPiezas, 
            imgDataArrayDes[cont], 
            ((length+1)*i)+5, 
            ((length+1)*j)+5, 
            false,
            false
          );

          miArrayDisponibles.push(miPiezaActual);
          
      }
       
      
      if(miArrayDisponibles[cont] != undefined){ //para que solo la pinte cuando exista  
         
          ctxPiezas.putImageData(
            miArrayDisponibles[cont].getImgData(),
            miArrayDisponibles[cont].getPosX(),
            miArrayDisponibles[cont].getPosY()
          );
      }
      cont++;

    }
  }

}


//FUNCION QUE RECORTA Y DIBUJA LAS PIEZAS DEL PUZZLE ADEMAS
//DE ALMACENAR CADA PIEZA EN UN OBJETO miPieza
function cambiaDificultad(i){
  asdfg= i.selectedIndex;
  switch(asdfg){
    case 0:
    ilength = 6;
    jlength = 4;
    length = 60;
    break;
    case 1:
    ilength = 9;
    jlength = 6;
    length = 40;
    break;
    case 2:
    ilength = 12;
    jlength = 8;
    length = 30;
    break;
  }
    miArrayPuzzle=new Array();
   iniciarCanvasPuzzle();
   if(!nohayimagen){
    recortarImagen();
   }
}

function recortarImagen(){ //DIFICULTAD ALTA
  ctxPiezas = cvPiezas.getContext('2d');
  ctxPuzzle = cvPuzzle.getContext('2d'); 

  ctxPuzzle.drawImage(imagenSelecionada, 0, 0, 360, 240); //Esto lo he cambiado era 480 y 360

  //almaceno la imagen para luego compararla con el resultado
  imageDataOriginal = ctxPuzzle.getImageData(0, 0, 360, 240); //Esto lo he cambiado era 480 y 360


  //METO EN imgDataArrayOrd LAS 48 PIESZAS DE LA IMAGEN
  for(i = 0; i < ilength; i++){
    for(j = 0; j < jlength; j++){
      imgDataArrayOrd.push(ctxPuzzle.getImageData(length*i,length*j,length,length));
    }
  }

  //CLONO Y DESORDENO EL ARRAY
  imgDataArrayDes = imgDataArrayOrd.slice(0);
  imgDataArrayDes = imgDataArrayDes.sort(function() {return Math.random() - 0.5});

  iniciarCanvasPuzzle();
  nohayimagen=false;
  iniciarCanvasPiezas();
  
  //Añado los eventListener para poder hacer click derecho en ambos canvas
  cvPiezas.addEventListener("mousedown",clikCanvasPiezas,false);
  cvPuzzle.addEventListener("mousedown",clikCanvasPuzzle,false);

}


//funcion que actualiza la posicion en la que he clicado en el canvas de piezas
function clikCanvasPiezas(e){

  //compruebo si hay alguna pieza del canvas puzzle seleccionada para deseleccionarla
  var piezaPuzzle = miArrayPuzzle.filter(function(el){
    return el.selec == true;
  });
  if(piezaPuzzle.length > 0){
    piezaPuzzle[0].quitarContorno();
    piezaActualPuzzle = undefined;
  }


  if(e.offsetX) {
      mouseXpiezas = e.offsetX;
      mouseYpiezas = e.offsetY;
  }
  else if(e.layerX) {
      mouseXpiezas = e.layerX;
      mouseYpiezas = e.layerY;
  }

  toglePiezaDisponibles();
}

//selecciona o deselecciona la piezza clicada del canvas de piezas disponibles
function toglePiezaDisponibles(){


  piezaSelec = miArrayDisponibles.filter(function(el){
      return mouseXpiezas >= el.posX    &&
             mouseXpiezas <= el.posX+length &&
             mouseYpiezas >= el.posY    &&
             mouseYpiezas <= el.posY+length;
  });

  piezaActualPiezas = piezaSelec[0];
  
  if(piezaActualPiezas != undefined){
      if(!piezaActualPiezas.getSelec() ){ //si la pieza actual no esta seleccionada

        //cojo la pieza que esta seleccionada
        piezaUltima = miArrayDisponibles.filter(function(el){
          return el.selec == true;
        });

        if(piezaUltima.length >= 1){ //si hay alguna pieza selecionada anteriormente
          piezaUltima[0].quitarContorno();
        }

        piezaActualPiezas.ponerContorno();
      }
      else{
        piezaActualPiezas.quitarContorno();
        piezaActualPiezas = undefined;
      }
  }

  else{ //para cuando pincho en una zona vacia del canvas y tengo una pieza contorneada
    iniciarCanvasPiezas();
  }

}

//se activa cuando clico en el canvas puzzle
function clikCanvasPuzzle(e){
  if(e.offsetX) {
      mouseXpuzzle = e.offsetX;
      mouseYpuzzle = e.offsetY;
  }
  else if(e.layerX) {
      mouseXpuzzle = e.layerX;
      mouseYpuzzle = e.layerY;
  }

  manejarPuzzle();

}


function manejarPuzzle(){

  var piezaClicada = miArrayPuzzle.filter(function(el){
      return mouseXpuzzle >= el.posX    &&
             mouseXpuzzle <= el.posX+length &&
             mouseYpuzzle >= el.posY    &&
             mouseYpuzzle <= el.posY+length;
  });


  //PIEZA DISPONIBLE NO SELECCIONADA
  if(piezaClicada[0] != undefined && piezaActualPiezas == undefined){ 

    //caso 1: La pieza que toco es la misma que tengo  selleccionada
    if(piezaClicada[0] == piezaActualPuzzle){
      piezaActualPuzzle.quitarContorno();
      piezaActualPuzzle = undefined;
    }
    //caso 2: La pieza que toco es distinta a la que tengo  selleccionada
    else{
        //caso 2.1, si toco una pieza y no tengo ninguna seleccionada ->la selecionare
        if(piezaActualPuzzle == undefined){
          piezaClicada[0].ponerContorno();
          piezaActualPuzzle = piezaClicada[0];
        }
        //caso 2.2, si toco una pieza y tengo una seleccionada ->las intercambiare
        else{      
            var auxUltima = piezaClicada[0].getCont();
            var imgUltima = piezaClicada[0].getImgData();

            var auxActual = piezaActualPuzzle.getCont();
            var imgActual = piezaActualPuzzle.getImgData();


            miArrayPuzzle[auxUltima].setImgData(imgActual);
            miArrayPuzzle[auxActual].setImgData(imgUltima);


            iniciarCanvasPuzzle();
            aumentarMovimientos(contadorMovimientos.innerHTML);

            miArrayPuzzle[auxActual].setSelec();
            piezaActualPuzzle = undefined;
        }
    }  

  }
  //PIEZA DISPONIBLE SELECCIONADA
  else if(piezaClicada[0] != undefined && piezaActualPiezas.getSelec() ){
    if(piezaClicada[0].getOcupada() == false){
        piezaClicada[0].setCanvas(cvPuzzle);
        piezaClicada[0].setContext(ctxPuzzle);
        piezaClicada[0].setImgData(piezaActualPiezas.getImgData());
        //piezaClicada[0].setOcupada();

        ctxPuzzle.putImageData(
          piezaClicada[0].getImgData(),
          piezaClicada[0].getPosX(),
          piezaClicada[0].getPosY()
        );

        //quito imagen del array del canvas de piezas desponibles
        delete miArrayDisponibles[piezaActualPiezas.getCont()] ;
        piezaActualPiezas.setSelec();
        piezaActualPiezas = undefined;

        iniciarCanvasPiezas();
        iniciarCanvasPuzzle();
        aumentarMovimientos(contadorMovimientos.innerHTML);
    }
    else{
      mostrarPopUp("Esta casilla ya esta ocupada");
    }

  }

}


function aumentarMovimientos(val){
  var movimientos = parseInt(val)+1;
  contadorMovimientos.innerHTML = movimientos;

  if(contadorMovimientos.innerHTML == 1){
    control = setInterval(cronometro,10);
    reinicio();
  }
}


function comprobarResultado(){
  iniciarCanvasPuzzle();
  clearInterval(control);
  parar();

  if(piezaActualPuzzle != undefined){
    piezaActualPuzzle = undefined;
    
  }

  imageDataPuzzle = ctxPuzzle.getImageData(0, 0, 360, 240);




  worker.postMessage({
    'imageDataOriginal':imageDataOriginal.data,
    'imageDataPuzzle':imageDataPuzzle.data, 
  });  

    worker.onmessage = function(e){ // Se asigna el handler para el evento message
      contMalColocadas = e.data.res;
      marcarResultado();

    };
}


function marcarResultado(){
  if(contMalColocadas.length == 0){
    clearInterval(control);
    parar();
    mostrarPopUp("Has conseguido montar el Puzzle! Movimientos: " + contadorMovimientos.innerHTML);
  }
  else{
    //console.log(contMalColocadas);
    for(i = 0; i<contMalColocadas.length; i++){
      var cont = contMalColocadas[i];
      //miArrayPuzzle[cont].marcarMalColocada();
    }   
  }
   
}


function cerrarPopUp(){
  if(textoPopUp.innerHTML == "Has conseguido montar el Puzzle! Movimientos: " + contadorMovimientos.innerHTML){
    clearInterval(control);
    location.reload();
    parar();
  }

  document.getElementById("popUp").style.visibility ="hidden";

  document.getElementById("header").style.opacity = 1;
  document.getElementById("main").style.opacity = 1;
  document.getElementById("footer").style.opacity = 1;



}

function NuevoJuego(){
  location.reload();
}

function mostrarPopUp(val){
  textoPopUp.innerHTML = val;
  document.getElementById("popUp").style.visibility ="visible";

  document.getElementById("header").style.opacity = 0.3;
  document.getElementById("main").style.opacity = 0.3;
  document.getElementById("footer").style.opacity = 0.3;

}

function dragStart(event){
  event.dataTransfer.effectAllowed = 'move';

  if(event.offsetX) {
    mouseXpiezas = event.offsetX;
    mouseYpiezas = event.offsetY;
  }else if(event.layerX) {
    mouseXpiezas = event.layerX;
    mouseYpiezas = event.layerY;
  }
  
  piezaSelec = miArrayDisponibles.filter(function(el){
      return mouseXpiezas >= el.posX    &&
             mouseXpiezas <= el.posX+length &&
             mouseYpiezas >= el.posY    &&
             mouseYpiezas <= el.posY+length;
  });

  if(piezaSelec[0] != undefined){
      ctxUnica.putImageData(piezaSelec[0].getImgData(),0,0);

      var img = document.createElement("img");

      var src = cvUnica.toDataURL();

      img.src = src;



      event.dataTransfer.setDragImage(img, length/2, length/2);


      event.dataTransfer.setData("Text", piezaSelec[0].getCont());
  }
}


  if(event.offsetX) {
        mouseXpuzzle = event.offsetX;
        mouseYpuzzle = event.offsetY;
  }
  else if(event.layerX) {
      mouseXpuzzle = event.layerX;
      mouseYpuzzle = event.layerY;
  }

  piezaSelec = miArrayPuzzle.filter(function(el){
      return mouseXpuzzle >= el.posX    &&
             mouseXpuzzle <= el.posX+length &&
             mouseYpuzzle >= el.posY    &&
             mouseYpuzzle <= el.posY+length;
  });

  if(!piezaSelec[0].getOcupada()){

    aumentarMovimientos(contadorMovimientos.innerHTML);

    piezaSelec[0].setImgData(miArrayDisponibles[parseInt(data)].getImgData());

    delete miArrayDisponibles[[parseInt(data)]] ;
    piezaActualPiezas = undefined;

    iniciarCanvasPiezas();
    iniciarCanvasPuzzle();
  }
  else{
    mostrarPopUp("Esta casilla ya esta ocupada");
  }

   function dropPuzzle(event){
  

  
  event.preventDefault();
  var data = event.dataTransfer.getData("Text");

  if (event.stopPropagation)
  event.stopPropagation(); // Evita la propagación del evento


}














