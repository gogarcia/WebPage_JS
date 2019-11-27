self.onmessage = function(e){
	var data = e.data;

	var imageDataOriginal = data.imageDataOriginal;
	var imageDataPuzzle = data.imageDataPuzzle;

	var contMalColocadas = new Array();
	
	var fila = 0
	var columna = 0;

  	for(i = 0; i<imageDataPuzzle.length; i++){
    	if(imageDataOriginal[i] != imageDataPuzzle[i]){
      		fila = i/115200;
      		fila = parseInt(fila);

      		columna = parseInt(i/240)%8;

      		var elemento = (columna*6)+fila;
          contMalColocadas.push(i);  
      		if(contMalColocadas.indexOf(elemento) == -1){
      			contMalColocadas.push(elemento);	
      		}

      		
    	}

  	}

  	self.postMessage( {'res': contMalColocadas} );

};