import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpaceService {
  rewrite$ = new Subject<void>();
  bigbang$ = new Subject<void>();
}