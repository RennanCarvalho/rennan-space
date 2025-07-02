import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconService } from '../../services/icon.service';
import { MatIconModule } from '@angular/material/icon';
import { LogoComponent } from "../logo/logo.component";

@Component({
  selector: 'app-header',
  imports: [RouterModule, MatIconModule, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private _icons: IconService) {}

}
