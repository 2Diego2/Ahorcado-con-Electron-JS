//src/renderer.js
window.onload = function (){
let palabrita = '';
let cant_errores = 0;
let cant_aciertos = 0;

    const palabras = [
 'manzana',
 'caramelos',
 'ñoquis'
];
const btn =document.getElementById('jugar');
const imagen = id('imagen');
const btn_letras= document.querySelectorAll("#letras button");

/*click en iniciar juego y su respectiva funcion */
btn.addEventListener('click', iniciar);



console.log (btn);



function iniciar(event){
    imagen.src = '../assets/images/Inicio.png';
    btn.disabled = true; // para que no pueda apretar el boto mas de una vez..
     cant_errores = 0;
 cant_aciertos = 0;
    
    const parrafo =id('palabra_a_adivinar');
    parrafo.innerHTML = ''; // se limpia cada vez que se apreta el boton.

      id('resultado').innerHTML = ''; // limpiamos el resultado de la partida ant.
    const cant_palabras = palabras.length;
    const valor_al_azar = obtener_random(0, cant_palabras);
    palabrita = palabras [ valor_al_azar ];
          console.log(palabrita);
    
    const cant_letras = palabrita.length;
    for ( let i = 0; i < btn_letras.length; i++){
    btn_letras[i].disabled = false;
} 
    for (let i = 0; i< cant_letras; i++){
        const span = document.createElement('span');
       parrafo.appendChild(span); // Lo que hace es cuando apreta obtener palabra, saca un valor al azar, 
       // busca una palabra al azar, muestra la palabra en consola a adivinar y 
       // crea un span por cada letra de la palabra a adivinar.

    }
}
/*------*/

/* click de adivinar letra y su funcion respectiva*/
for ( let i = 0; i < btn_letras.length; i++){
    btn_letras[i].addEventListener('click',click_letras);
}

function click_letras (event){
    const spans = document.querySelectorAll('#palabra_a_adivinar span');
    const button = event.target; //que boton apreto
        button.disabled = true; // para que no pueda apretar la palabra mas de una vez..
            
        const letra = button.innerHTML.toLowerCase( );
        const palabra = palabrita.toLowerCase( );
        
        let acerto = false;
        for (let i = 0; i < palabra.length; i++){
        if (letra == palabra[i]){
            //la variable i es la psoicion de la letra en la palabra
            //que coincide con el span al que tenemos que mostrarle esta letra.
           spans[i].innerHTML = letra;
           cant_aciertos++;
            acerto = true;
        } 
        }
        if (acerto == false){
               cant_errores++;
            const source = `../assets/images/Error${cant_errores}.png`;
            const imagen = id('imagen');
            imagen.src= source;
        }

        if (cant_errores == 7){
            id('resultado').innerHTML ='¡Perdiste!, la palabra era: ' + palabrita;
         game_over ( ); 
        }else if(cant_aciertos == palabrita.length){
               id('resultado').innerHTML ='¡Ganaste!';
                 game_over ( ); 

            }
      //console.log("la letra" + letra + " en la palabra " + palabra + " ¿existe?: " + acerto);

}
/*-------------------*/

//Fin juego
function game_over ( ){
for ( let i = 0; i < btn_letras.length; i++){
    btn_letras[i].disabled = true;
}
//Ya perdio o gano y puede volver a jugar
 btn.disabled = false;
}

game_over( ); //Para que no se pueda jugar al inicio, sin pedir una palabra.
} 