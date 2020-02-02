import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { GGJ2020Service } from './services/ggj2020.service';

import { GameHostComponent } from './game_logic/host/game-host/game-host.component';
import { UiHostComponent } from './game_logic/host/ui-host/ui.component';

import { GameClientComponent } from './game_logic/client/game-client/game-client.component';
import { UiClientComponent } from './game_logic/client/ui-client/ui-client.component';

import { ButtonComponent } from './game_logic/client/ui-client/button/button.component';

const routes: Routes =
[
    { path: 'game-host', component: GameHostComponent },
    { path: 'game-client', component: GameClientComponent },
    { path: '', redirectTo: 'game-client', pathMatch: 'full' }
];
@NgModule({
  declarations: [
    AppComponent,
    GameHostComponent,
    UiHostComponent,
    GameClientComponent,
    ButtonComponent,
    UiClientComponent
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