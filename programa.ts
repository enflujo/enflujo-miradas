import './estilos.scss';
import 'photoswipe/style.css';
import Galeria from 'photoswipe/lightbox';

const galeria = new Galeria({
  gallery: '#galeria',
  children: 'a',
  pswpModule: () => import('photoswipe'),
});
galeria.init();

raton();

function raton() {
  const contenedor = document.getElementById('miradas') as HTMLDivElement;
  const base = '/enflujo-miradas/miradas';
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
    columnas: 7,
    filas: 5,
    x: 0,
    y: 0,
    fotograma: { ancho: 0, alto: 0 },
    centro: { x: 0, y: 0 },
  };
  `${base}/`;
  const animaciones = [
    { nombre: 'Juan José Vergara', fuente: `${base}/calabaza.jpg`, fondo: '#FFF', img: new Image() },
    { nombre: 'Karol Escobar #1', fuente: `${base}/Gatete.jpg`, fondo: '#000', img: new Image() },
    { nombre: 'Karol Escobar #2', fuente: `${base}/Gateto.jpg`, fondo: '#000', img: new Image() },
    { nombre: 'Nelson Ojeda', fuente: `${base}/nelson.jpg`, fondo: '#FFF', img: new Image() },
    { nombre: 'Laura Muñoz', fuente: `${base}/laura-munoz.jpg`, fondo: '#FFF', img: new Image() },
    { nombre: 'Sebastian Ariza', fuente: `${base}/Samurai.jpg`, fondo: '#FFF', img: new Image() },
  ];

  animaciones.forEach((animacion, i) => {
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
      contenedor.style.backgroundColor = animacion.fondo;
      imgActual = animacion.img;
    };

    if (i === 0) {
      boton.dispatchEvent(new Event('click'));
    }

    contenedorAnimaciones.appendChild(boton);
  });

  const centro = { x: 0, y: 0 };

  cuadricula.x = 3;
  cuadricula.y = 2;

  function inicio() {
    cargando = false;
    cuadricula.ancho = imgActual.naturalWidth;
    cuadricula.alto = imgActual.naturalHeight;
    cuadricula.fotograma.ancho = (cuadricula.ancho / cuadricula.columnas) | 0;
    cuadricula.fotograma.alto = (cuadricula.alto / cuadricula.filas) | 0;
    cuadricula.centro.x = (cuadricula.fotograma.ancho / 2) | 0;
    cuadricula.centro.y = (cuadricula.fotograma.alto / 2) | 0;

    escalar();
  }

  function escalar() {
    const { width, height } = contenedor.getBoundingClientRect();
    lienzo.width = ancho = width;
    lienzo.height = alto = height;
    centro.x = (ancho / 2) | 0;
    centro.y = (alto / 2) | 0;

    pintar();
  }

  function pintar() {
    ctx.clearRect(0, 0, lienzo.width, lienzo.height);
    ctx.drawImage(
      imgActual,
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

  contenedor.onmousemove = (evento) => {
    if (cargando) return;
    const { left, top } = contenedor.getBoundingClientRect();
    cuadricula.x = (((evento.clientX - left) / ancho) * cuadricula.columnas) | 0;
    cuadricula.y = (((evento.clientY - top) / alto) * cuadricula.filas) | 0;

    pintar();
  };

  window.onresize = escalar;
}
