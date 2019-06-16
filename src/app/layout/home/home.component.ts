import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { DatePipe, Location } from '@angular/common';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../.././service/api.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export interface Country {
  id: any;
  address: any;
}
export interface City {
  id: any;
  name: any;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  mobileQueryListener: () => void;
  query: any;
  filteredCountry: Observable<Country[]>;
  countryControl = new FormControl();
  countryitem: any;
  lat: number;
  lon: number;
  cityControl = new FormControl();
  cityitem: any;
  header: any;
  icon: any;
  widthsmall: any = 100;
  unititem: any = [
    {id: 1, name: 'Kelvin'},
    {id: 2, name: 'Fahrenheit'},
    {id: 3, name: 'Celsius'}
  ];
  tempControl = new FormControl();
  dataitem: any;
  dataitem2: any;
  favitem: any = [];
  favlength: any;
  id = 1;
  collecttemp: number;
  collecttempmin: number;
  collecttempmax: number;
  twhour: any = [];
  citytwhour: any;
  twname: any = [];
  twpic: any = [];
  twunit: string;
  cuunit: string;
  cityitem2: any = [];
  currentdate: any = new Date();
  constructor(
                changeDetectorRef: ChangeDetectorRef,
                media: MediaMatcher,
                private datePipe: DatePipe,
                private location: Location,
                private router: Router,
                private api: ApiService,
                private route: ActivatedRoute,
                private domSanitizer: DomSanitizer
              ) {
                  this.cityControl.disable();
                  this.favlength = this.favitem.length;
                  this.tempControl.disable();
                  this.mobileQuery = media.matchMedia('(max-width: 1023px)');
                  this.mobileQueryListener = () => changeDetectorRef.detectChanges();
                  this.mobileQuery.addListener(this.mobileQueryListener);
                  if ( (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
                  && (screen.width <= 1023)) {
                     this.header = 'Please click search button below...';
                  } else {
                    this.header = 'Please search a contry...';
                  }
                }

  ngOnInit() {
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }
  get_location(event) {
    this.citytwhour = '';
    this.twhour = [];
    this.twpic = [];
    this.dataitem = undefined;
    this.collecttemp = undefined;
    this.collecttempmin = undefined;
    this.collecttempmax = undefined;
    this.cityControl = new FormControl();
    this.api.get_location(event.target.value).subscribe((response: any) => {
      this.countryitem = response.results;
      this.filter();
    },
    (error: any) => {
      console.log(error);
    });
  }
  filter() {
    this.filteredCountry = this.countryControl.valueChanges
    .pipe(
      startWith<string | Country>(''),
      map(value => typeof value === 'string' ? value : value.address.country),
      map(address => address ? this._filter(address.country) : this.countryitem.slice())
    );
  }
  private _filter(country: string): Country[] {
    if (country === undefined) {
      return [];
    } else {
      const filterValue = country.toLowerCase();
      return this.countryitem.filter(countryitem => countryitem.address.country.toLowerCase().indexOf(filterValue) === 0);
    }
  }
  displayFn(countryitem?: Country): string | undefined {
   return countryitem ? countryitem.address.freeformAddress + ',' + countryitem.address.country : undefined;
  }
  get_lat_lon(event) {
    if (event.source.selected) {
      this.lat = event.source.value.position.lat;
      this.lon = event.source.value.position.lon;
      this.api.get_current_weather(this.lat, this.lon).subscribe((response: any) => {
        this.cityitem = response.list;
        this.cityitem2 = response.list;
        if (this.cityitem.length === 0) {
          alert('Not found cities around the point');
        }
        this.cityControl.enable();
      },
      (error: any) => {
        console.log(error);
      });
    }
  }
  get_city(event) {
    this.id = 1;
    this.cuunit = 'K';
    this.cityitem = this.cityitem2;
    this.tempControl.disable();
    this.dataitem = event;
    this.collecttemp = event.main.temp;
    this.collecttempmin = event.main.temp_min;
    this.collecttempmax = event.main.temp_max;
    this.get_icon();
    this.add_fav();
    this.tempControl.enable();
  }
  get_icon() {
   this.icon = 'http://openweathermap.org/img/w/' + this.dataitem.weather[0].icon + '.png';
  }
  get_data(event) {
    if (event.source.selected) {
      this.cityControl.disable();
      this.id = event.source.value.id;
      if (this.id === 1) {
        this.cuunit = 'K';
        this.dataitem.main.temp = this.collecttemp;
        this.dataitem.main.temp_min = this.collecttempmin;
        this.dataitem.main.temp_max = this.collecttempmax;
        this.dataitem2 = this.dataitem;
      } else if (this.id === 2) {
        this.cuunit = '°F';
        this.dataitem.main.temp = ((this.collecttemp - 273.15) * (9 / 5) + 32).toFixed(2);
        this.dataitem.main.temp_min = ((this.collecttempmin - 273.15) * (9 / 5) + 32).toFixed(2);
        this.dataitem.main.temp_max = ((this.collecttempmax - 273.15) * (9 / 5) + 32).toFixed(2);
      } else {
        this.cuunit = '°C';
        this.dataitem.main.temp = (this.collecttemp - 273.15).toFixed(2);
        this.dataitem.main.temp_min = (this.collecttempmin - 273.15).toFixed(2);
        this.dataitem.main.temp_max = (this.collecttempmax - 273.15).toFixed(2);
      }
      this.get_24hr();
    }
  }
  add_fav() {
    this.favitem.push(this.dataitem);
    this.favlength = this.favitem.length;
  }
  delete_fav(j) {
    this.favitem.splice(j, 1);
  }
  get_24hr() {
    this.api.get_24hr(this.lat, this.lon, this.id).subscribe((response: any) => {
      this.citytwhour = response.city;
      this.twhour = response.list.slice(0, 4);
      for (let i = 0; i < this.twhour.length; i++) {
        this.twname[i] = this.twhour[i].weather[0].icon;
        this.twpic[i] = 'http://openweathermap.org/img/w/' + this.twname[i] + '.png';
      }
      if (this.id === 1) {
        this.twunit = 'K';
      } else if (this.id === 2) {
        this.twunit = '°F';
      } else {
        this.twunit = '°C';
      }
    },
    (error: any) => {
      console.log(error);
    });
  }
}
