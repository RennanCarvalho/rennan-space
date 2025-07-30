import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]',
})
export class RevealOnScrollDirective implements AfterViewInit {
  @Input() direction: 'up' | 'down' | 'left' | 'right' | 'zoom' = 'left';
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const element = this.el.nativeElement;
    const style = element.style;
    element.classList.add('reveal');

    switch (this.direction) {
      case 'up':
        style.transform = 'translateY(100px)';
        break;
      case 'down':
        style.transform = `translateY(-100px)`;
        break;
      case 'left':
        style.transform = 'translateX(-100px)';
        break;
      case 'right':
        style.transform = 'translateX(100px)';
        break;
      case 'zoom':
        style.transform = 'perspective(0) translateZ(100px)';
        break;
    }

    setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              style.opacity = '1';
              style.transform = 'translateX(0) translateY(0) translateZ(0)';
              observer.unobserve(element);
            }
          });
        },
        { rootMargin: '0px 0px -300px 0px' }
      );

      observer.observe(element);
    }, 50);
  }
}
