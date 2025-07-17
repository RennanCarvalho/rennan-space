import { Component, ElementRef, ViewChild } from '@angular/core';
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
  onCooldown = false;
  private COOLDOWN = 20000;

  constructor(
    private _icons: IconService,
    private spaceService: SpaceService
  ) {}

  Rewrite() {
    this.SetCooldown();
    this.spaceService.rewrite$.next();
  }
  BigBang() {
    this.SetCooldown();
    this.spaceService.bigbang$.next();
  }

  SetCooldown() {
    this.onCooldown = true;
    setTimeout(() => (this.onCooldown = false), this.COOLDOWN);
  }
}
