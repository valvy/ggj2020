import { Component } from '@angular/core';
import { FormfillerService } from './services/formfiller.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'formfiller-frontend';
  data : string;
  constructor(private formfiller : FormfillerService ) {
    formfiller.getStuff().subscribe((dat) => {
        this.data = dat.id;
     
    });
    
  }
}
