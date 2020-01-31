import { Component } from '@angular/core';
import { GGJ2020Service } from './services/ggj2020.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent 
{
    title = 'GGJ2020-frontend';
    data : string;
    constructor(private formfiller : GGJ2020Service )
    {
        formfiller.getStuff().subscribe((dat) =>
        {
            this.data = dat.id;     
        });    
    }
}