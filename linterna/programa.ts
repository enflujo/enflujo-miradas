import './estilos.scss';
import Luz from './Luz';
import { escalarLienzo, escalarVideo, iniciarCamara } from './ayudas';

const lienzo = document.getElementById('lienzo') as HTMLCanvasElement;
const lienzo2 = document.createElement('canvas');
const ctx = lienzo.getContext('2d') as CanvasRenderingContext2D;
const ctx2 = lienzo2.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;

const imgs: HTMLImageElement[] = [];
const luces: Luz[] = [];
let reloj = 0;
const cuadricula = {
  cols: 25,
  filas: 20,
  ancho: 0,
  alto: 0,
  proporcion: 0,
  anchoPantalla: 0,
  altoPantalla: 0,
};
const totalImgs = 55;
const umbral = 250;

async function cargarImgs(): Promise<void> {
  let numeroImgsCargadas = 0;

  return new Promise((resolver) => {
    for (let i = 0; i < totalImgs; i++) {
      const ruta = `/enflujo-miradas/luz/luz_${String(i).padStart(5, '0')}.webp`;
      const img = new Image();
      img.onload = () => {
        if (revisarCargadas()) {
          resolver();
        }
      };
      img.src = ruta;
      imgs.push(img);
    }
  });

  function revisarCargadas() {
    numeroImgsCargadas = numeroImgsCargadas + 1;
    return numeroImgsCargadas === totalImgs;
  }
}

async function inicio() {
  await cargarImgs();
  const camara = (await iniciarCamara()) as HTMLVideoElement;

  if (camara) {
    escalarVideo(camara);
    lienzo2.width = camara.videoWidth;
    lienzo2.height = camara.videoHeight;
    //document.body.appendChild(lienzo2);
  }

  escalarLienzo(lienzo, ctx, false);
  cuadricula.ancho = (lienzo2.width / cuadricula.cols) | 0;
  cuadricula.alto = (lienzo2.height / cuadricula.filas) | 0;
  cuadricula.anchoPantalla = (lienzo.width / cuadricula.cols) | 0;
  cuadricula.altoPantalla = (lienzo.height / cuadricula.filas) | 0;
  cuadricula.proporcion = cuadricula.ancho * cuadricula.alto;

  ciclo();

  function ciclo() {
    ctx2.drawImage(camara, 0, 0, lienzo2.width, lienzo2.height);
    ctx.fillRect(0, 0, lienzo.width, lienzo.height);

    for (let fila = 0; fila < cuadricula.filas; fila++) {
      for (let col = 0; col < cuadricula.cols; col++) {
        const y = fila * cuadricula.alto;
        const x = col * cuadricula.ancho;
        const datosImagen = ctx2.getImageData(x, y, cuadricula.ancho, cuadricula.alto);
        const pixeles = datosImagen.data;
        const intensidad = brillo(pixeles);

        if (intensidad >= umbral) {
          const x2 = (cuadricula.cols - col) * cuadricula.anchoPantalla;
          const y2 = fila * cuadricula.altoPantalla;
          luces.push(new Luz(ctx, x2, y2, totalImgs, imgs));
          break;
        }
      }
    }
    ctx.save();
    ctx.globalCompositeOperation = 'lighten';
    luces.forEach((luz) => {
      luz.pintar();
    });

    ctx.restore();
    reloj = window.requestAnimationFrame(ciclo);
  }
}

function brillo(pixeles: Uint8ClampedArray) {
  let suma = 0;
  const { proporcion } = cuadricula;

  for (let x = 0; x < pixeles.length; x += 4) {
    const r = pixeles[x];
    const g = pixeles[x + 1];
    const b = pixeles[x + 2];
    const promedio = Math.floor((r + g + b) / 3);
    suma += promedio;
  }

  return Math.floor(suma / proporcion);
}

inicio().catch(console.error);
