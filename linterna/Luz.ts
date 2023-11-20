export default class Luz {
  x: number;
  y: number;
  fotograma: number;
  total: number;
  ctx: CanvasRenderingContext2D;
  imgs: HTMLImageElement[];
  vivo: boolean;
  ancho: number;
  alto: number;

  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, total: number, imgs: HTMLImageElement[]) {
    this.x = x - 300;
    this.y = y;
    this.fotograma = 0;
    this.total = total;
    this.ctx = ctx;
    this.imgs = imgs;
    this.vivo = true;
    this.ancho = 500;
    this.alto = 281;
  }

  pintar() {
    if (!this.vivo) return;
    const ctx = this.ctx;

    if (this.fotograma < this.total) {
      ctx.drawImage(this.imgs[this.fotograma], this.x, this.y, this.ancho, this.alto);
      this.fotograma++;
    }
  }
}
