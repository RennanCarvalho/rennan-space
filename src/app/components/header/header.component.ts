import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconService } from '../../services/icon.service';
import { MatIconModule } from '@angular/material/icon';
import { SpaceService } from '../../services/space.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(
    private _icons: IconService,
    private spaceService: SpaceService
  ) {}

  Rewrite() {
    this.spaceService.rewrite$.next();
  }
  BigBang() {
    this.spaceService.bigbang$.next();
    
  }
}
