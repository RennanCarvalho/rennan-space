import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { GameComponent } from './pages/game/game.component';


export const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'game', component: GameComponent },
            { path: '**', redirectTo: '', pathMatch: 'full' }
        ]
    }
];
