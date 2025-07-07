import { Component } from '@angular/core';
import { PresentationComponent } from "../../components/section/presentation/presentation.component";
import { DivisorComponent } from "../../components/divisor/divisor.component";
import { SkillsComponent } from "../../components/section/skills/skills.component";

@Component({
  selector: 'app-home',
  imports: [PresentationComponent, DivisorComponent, SkillsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
