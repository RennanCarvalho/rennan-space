import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]'
})
export class RevealOnScrollDirective implements AfterViewInit {

  @Input() direction: 'up' | 'down' | 'left' | 'right' = 'up';
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const style = this.el.nativeElement.style;
    switch (this.direction) {
      case 'up':
        style.transform = 'translateY(30px)';
        break;
      case 'down':
        style.transform = `translateY(-30px)`;
        break;
      case 'left':
        style.transform = 'translateX(-30px)';
        break;
      case 'right':
        style.transform = 'translateX(30px)';
        break;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          style.opacity = '1';
          style.transform = 'translateX(0) translateY(0)';
          observer.unobserve(this.el.nativeElement);
        }
      });
    }, { rootMargin: '0px 0px -100px 0px' });

    observer.observe(this.el.nativeElement);
  }
}
