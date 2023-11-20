export async function iniciarCamara(): Promise<HTMLVideoElement | null> {
  const camara = document.getElementById('camara') as HTMLVideoElement;
  if (!camara) return null;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Tu explorador no tiene acceso a la cámara web');
  }

  const videoConfig = {
    audio: false,
    video: {
      facingMode: 'user',
      width: 320,
      height: 180,
      frameRate: { ideal: 60 },
    },
  };

  const stream = await navigator.mediaDevices.getUserMedia(videoConfig);
  camara.srcObject = stream;

  camara.play();
  return new Promise((resolve) => {
    camara.onloadedmetadata = () => {
      resolve(camara);
    };
  });
}

export function escalarVideo(camara: HTMLVideoElement) {
  if (!camara) return;

  camara.width = camara.videoWidth;
  camara.height = camara.videoHeight;
}

export function escalarLienzo(lienzo: HTMLCanvasElement, ctx: CanvasRenderingContext2D, invertir = true) {
  if (!ctx) return;
  lienzo.width = window.innerWidth;
  lienzo.height = window.innerHeight;

  // invertir lienzo de manera horizontal
  if (invertir) {
    ctx.translate(window.innerWidth, 0);
    ctx.scale(-1, 1);
  }
}

export function nuevoEventoEnFlujo(tipo, datos) {
  document.body.dispatchEvent(
    new CustomEvent('enflujo', {
      detail: { tipo, datos },
    })
  );
}
