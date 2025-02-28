import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainMenuComponent } from './main-menu/main-menu.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    MainMenuComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
