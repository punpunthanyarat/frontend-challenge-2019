import { Component, OnInit } from '@angular/core';
import { VERSION } from 'src/environments/version';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss']
})
export class VersionComponent implements OnInit {
  version = VERSION;
  production = environment.production;
  year;
  constructor() { }

  ngOnInit() {
    const date = new Date();
    const options = {
      year: 'numeric'
    };
    this.year = new Intl.DateTimeFormat('en', options).format(date);
  }

}
