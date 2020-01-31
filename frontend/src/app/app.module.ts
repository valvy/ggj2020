import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { GGJ2020Service } from './services/ggj2020.service';
import { GameComponent as GameHost } from './game_logic/host/game-host/game.component';
import { GameComponent as GameClient } from './game_logic/client/game-client/game.component';
import { UiComponent } from './game_logic/host/ui-host/ui.component';

const routes: Routes =
[
    { path: 'game-host', component: GameHost },
    { path: 'game-client', component: GameClient },
    { path: '', redirectTo: 'game', pathMatch: 'full' }
];
@NgModule({
  declarations: [
    AppComponent,
    GameHost,
    UiComponent,
    GameClient
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