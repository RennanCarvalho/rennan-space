import { Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from '@angular/material/icon';

const ICONS = [
  'at-sign',
  'chevrons-down',
  'code',
  'copy',
  'github',
  'home',
  'instagram',
  'linkedin',
  'mail',
  'maximize',
  'minimize',
  'moon',
  'pie',
  'power',
  'star',
  'thumbs-up',
  'youtube',
  'logo'];

@Injectable({ providedIn: 'root' })
export class IconService {
  constructor(reg: MatIconRegistry, sanitizer: DomSanitizer) {
    ICONS.forEach(name => {
      reg.addSvgIcon(name, sanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${name}.svg`));
    });
  }
}
