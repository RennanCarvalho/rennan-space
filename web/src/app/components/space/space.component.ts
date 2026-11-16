import { Component, ElementRef, ViewChild, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { SpaceService } from '../../services/space.service';

enum EObject {
  brownStar = '#671911',
  redStar = '#ffe595',
  whiteStar = '#ffffff',
  neutronStar = '#69cffb',
  rockyPlanet = '#446286',
  gasPlanet = '#c2a279',
}
const STAR_COLORS = Object.values(EObject) as string[];

interface StarParticle {
  angle: number;
  distance: number;
  targetDistance: number; // Para onde ela quer ir (evita o teleporte)
  speed: number;
  size: number;
  color: string;
  opacity: number;
  baseOpacity: number;
  pulseSpeed: number;
  pulseOffset: number;
}

@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrl: './space.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class SpaceComponent implements AfterViewInit, OnDestroy {
  @ViewChild('spaceCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('explosion') explosion!: ElementRef<HTMLDivElement>;

  private ctx!: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private stars: StarParticle[] = [];
  private content!: HTMLElement;

  private maxStars = 500;
  private isBigBangActive = false;
  private stateTimer = 0; // Controla as Fases do Big Bang

  private canRewrite = true;
  private canCinematic = true;
  private COOLDOWN = 20000;

  constructor(private spaceService: SpaceService) {}

  ngOnInit() {
    this.spaceService.rewrite$.subscribe(() => this.startRewrite());
    this.spaceService.bigbang$.subscribe(() => this.BigBang());
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.adjustStarCount();
    this.initStars();
    this.animate();

    this.content = document.querySelector('.content') as HTMLElement;
  }

  ngOnDestroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private adjustStarCount() {
    const area = window.innerWidth * window.innerHeight;
    this.maxStars = area < 400_000 ? 200 : area < 800_000 ? 300 : 500;
  }

  private rand(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  private initStars() {
    this.stars = [];
    const maxDim = Math.max(window.innerWidth, window.innerHeight);

    for (let i = 0; i < this.maxStars; i++) {
      const dist = this.rand(30, maxDim * 0.85);
      this.stars.push({
        angle: this.rand(0, Math.PI * 2),
        distance: dist,
        targetDistance: dist,
        speed: this.rand(0.0001, 0.0003), // Órbita lenta e majestosa
        size: this.rand(1, 2.5),
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        opacity: this.rand(0.3, 0.7),
        baseOpacity: this.rand(0.3, 0.7),
        // Frequência bem suave para o brilho (equivalente a 4-14s)
        pulseSpeed: this.rand(0.0005, 0.002),
        pulseOffset: this.rand(0, Math.PI * 2),
      });
    }
  }

  private animate = () => {
    const canvas = this.canvasRef.nativeElement;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];

      // Se o Big Bang estiver ativo, gerenciamos a transição fluida por fases
      if (this.isBigBangActive) {
        // Interpola suavemente a distância atual até a distância alvo (Evita o corte seco)
        star.distance += (star.targetDistance - star.distance) * 0.05;
        star.angle += 0.015; // Rotação de vórtice durante a ação
      } else {
        // Órbita normal, ajustando suavemente se houver mudança de alvo
        star.distance += (star.targetDistance - star.distance) * 0.05;
        star.angle += star.speed;
      }

      const x = centerX + Math.cos(star.angle) * star.distance;
      const y = centerY + Math.sin(star.angle) * star.distance;

      // Brilho suave e orgânico (Shine sincronizado e lento)
      const pulse = Math.sin(Date.now() * star.pulseSpeed + star.pulseOffset);
      const currentOpacity = star.baseOpacity + pulse * 0.25;
      const currentSize = star.size * (0.8 + (pulse + 1) * 0.1);

// Dentro do seu loop animate(), antes de dar o ctx.fill():
this.ctx.fillStyle = star.color;
this.ctx.globalAlpha = Math.max(0.1, Math.min(1, currentOpacity));

// --- ADICIONE ESTE BLOCO PARA CRIAR O BLUR/BRILHO AUTOMÁTICO ---
this.ctx.shadowBlur = 0; // Intensidade do desfoque (blur) ao redor da estrela
this.ctx.shadowColor = star.color; // A cor do brilho é a mesma da estrela
// -------------------------------------------------------------

this.ctx.beginPath();
this.ctx.arc(x, y, Math.max(0.5, currentSize), 0, Math.PI * 2);
this.ctx.shadowBlur = 0;
this.ctx.fill();

// Limpa a sombra para não afetar outros elementos que não precisam de brilho

    }

    this.ctx.globalAlpha = 1.0;
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  startRewrite() {
    if (!this.canRewrite) return;
    this.canRewrite = false;

    const maxDim = Math.max(window.innerWidth, window.innerHeight);
    this.stars.forEach(star => {
      // Define novos alvos gradualmente, sem saltos
      star.targetDistance = this.rand(30, maxDim * 0.85);
      star.speed = this.rand(0.0001, 0.0003);
    });

    setTimeout(() => (this.canRewrite = true), this.COOLDOWN);
  }

  BigBang() {
    if (!this.canRewrite || !this.content) return;

    this.triggerCinematic();
    this.isBigBangActive = true;

    // FASE 1: Puxa todas para o centro (Vórtice) nos primeiros 10 segundos
    this.stars.forEach(star => {
      star.targetDistance = 0; // Alvo é o centro exato
    });

    // FASE 2: Aos 10 segundos, explode e joga para as bordas suavemente
    setTimeout(() => {
      const maxDim = Math.max(window.innerWidth, window.innerHeight);
      this.stars.forEach(star => {
        star.targetDistance = this.rand(50, maxDim * 0.9); // Novo destino nas bordas
        star.speed = this.rand(0.0002, 0.0005);
      });
    }, 10000);

    // FASE 3: Aos 20 segundos, encerra a cinematográfica e volta à órbita normal
    setTimeout(() => {
      this.isBigBangActive = false;
      this.startRewrite();
    }, 20000);
  }

  private triggerCinematic() {
    if (!this.canCinematic) return;

    this.canCinematic = false;
    this.content.classList.remove('fade-in-out');
    this.explosion.nativeElement.classList.remove('active');
    
    void this.content.offsetWidth;
    void this.explosion.nativeElement.offsetWidth;

    this.content.classList.add('fade-in-out');   
    this.explosion.nativeElement.classList.add('active');

    setTimeout(() => (this.canCinematic = true), this.COOLDOWN);
  }
}