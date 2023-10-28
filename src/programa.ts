import './scss/estilos.scss';

const contenedorAnimaciones = document.getElementById('animaciones') as HTMLDivElement;
const lienzo = document.getElementById('lienzo') as HTMLCanvasElement;
const ctx = lienzo.getContext('2d') as CanvasRenderingContext2D;
let ancho = 0;
let alto = 0;
let cargando = true;
let imgActual: HTMLImageElement;

const cuadricula = {
  ancho: 0,
  alto: 0,
  cols: 7,
  rows: 5,
  x: 0,
  y: 0,
  fotograma: { ancho: 0, alto: 0 },
  centro: { x: 0, y: 0 },
};

const animaciones = [
  { nombre: 'Juanjo', fuente: 'calabaza.jpg', fondo: '#FFF', img: new Image() },
  { nombre: 'Karol #1', fuente: 'Gatete.jpg', fondo: '#000', img: new Image() },
  { nombre: 'Karol #2', fuente: 'Gateto.jpg', fondo: '#000', img: new Image() },
  { nombre: 'Nelson', fuente: 'nelson.jpg', fondo: '#FFF', img: new Image() },
];

animaciones.forEach((animacion) => {
  cargando = true;
  const boton = document.createElement('div');
  boton.innerText = animacion.nombre;
  boton.className = 'animacion';

  boton.onclick = () => {
    const activo = contenedorAnimaciones.querySelector<HTMLDivElement>('.activo');

    if (activo) {
      activo.classList.remove('activo');
    }

    boton.classList.add('activo');

    animacion.img.onload = inicio;
    animacion.img.src = animacion.fuente;
    document.body.style.backgroundColor = animacion.fondo;
    imgActual = animacion.img;
    cargando = false;
  };

  contenedorAnimaciones.appendChild(boton);
});

const centro = { x: 0, y: 0 };
const fotograma = { ancho: 0, alto: 0 };
cuadricula.x = 3;
cuadricula.y = 2;

function inicio() {
  cuadricula.ancho = imgActual.naturalWidth;
  cuadricula.alto = imgActual.naturalHeight;
  cuadricula.fotograma.ancho = (cuadricula.ancho / cuadricula.cols) | 0;
  cuadricula.fotograma.alto = (cuadricula.alto / cuadricula.rows) | 0;
  cuadricula.centro.x = (cuadricula.fotograma.ancho / 2) | 0;
  cuadricula.centro.y = (cuadricula.fotograma.alto / 2) | 0;

  escalar();
}

function escalar() {
  lienzo.width = ancho = window.innerWidth;
  lienzo.height = alto = window.innerHeight;
  centro.x = (ancho / 2) | 0;
  centro.y = (alto / 2) | 0;

  fotograma.ancho = (ancho / cuadricula.cols) | 0;
  fotograma.alto = (alto / cuadricula.rows) | 0;

  pintar();
}

function pintar() {
  ctx.drawImage(
    imgActual, // image
    cuadricula.x * cuadricula.fotograma.ancho,
    cuadricula.y * cuadricula.fotograma.alto,
    cuadricula.fotograma.ancho,
    cuadricula.fotograma.alto,
    centro.x - cuadricula.centro.x,
    centro.y - cuadricula.centro.y,
    cuadricula.fotograma.ancho,
    cuadricula.fotograma.alto
  );
}

lienzo.onmousemove = (event) => {
  console.log('hey');
  if (cargando) return;
  cuadricula.x = ((event.clientX / ancho) * cuadricula.cols) | 0;
  cuadricula.y = ((event.clientY / alto) * cuadricula.rows) | 0;

  pintar();
};

window.onresize = escalar;
