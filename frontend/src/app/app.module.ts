import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { GGJ2020Service } from './services/ggj2020.service';
import { GameComponent } from './game_logic/game/game.component';
import { UiComponent } from './game_logic/ui/ui.component';

const routes: Routes =
[
    { path: 'game', component: GameComponent },
    { path: '', redirectTo: 'game', pathMatch: 'full' }
];
@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    UiComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [GGJ2020Service],
  bootstrap: [AppComponent]
})
export class AppModule { }