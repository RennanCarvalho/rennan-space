import { Component } from '@angular/core';
import { PresentationComponent } from "../../components/section/presentation/presentation.component";
import { MountainsComponent } from "../../components/mountains/mountains.component";

@Component({
  selector: 'app-home',
  imports: [PresentationComponent, MountainsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
