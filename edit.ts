import { Component, OnInit, ViewChild, ElementRef, DoCheck } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpParams, HttpResponse, HttpEventType, HttpHeaders, HttpRequest, HttpClient } from '@angular/common/http';
import { FormArray, NgForm, FormGroup, FormGroupDirective, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-asset-edit',
  templateUrl: './asset-edit.component.html',
  styleUrls: ['./asset-edit.component.scss']
})
// export class AssetEditComponent implements OnInit, DoCheck {
export class AssetEditComponent implements OnInit {
  id: any;
  show_asset: any;
  test: FormArray;
  dd: FormGroup;
  asset: FormGroup;
  sub_asset: FormGroup;
  constructor(
                private datePipe: DatePipe,
                private location: Location,
                private api: ApiService,
                private router: Router,
                private _DomSanitizer: DomSanitizer,
                private route: ActivatedRoute,
                private fb: FormBuilder
              ) {
                  this.route.queryParams.subscribe((params) => {
                    this.id = params['id'];
                  });
                  this.test = this.fb.array([
                    this.fb.array([
                      this.fb.group({
                        skill: ['swiming'],
                        gender: ['male']
                      })
                    ]),
                    this.fb.group({
                      code: ['A B C'],
                      math: ['555']
                    })
                  ]);
                  this.dd = new FormGroup({
                    asset: new FormGroup({
                      name: new FormControl('Alice'),
                      lastname: new FormControl('Munkong')
                    }),
                    sub_asset: new FormArray([
                      new FormGroup({
                        sn: new FormControl('11-22'),
                        item: new FormControl('A1')
                      }),
                      new FormGroup({
                        sn: new FormControl('11-33'),
                        item: new FormControl('A2')
                      })
                    ])
                  });
                }
  ngOnInit() {
    console.log('fb', this.fb);
    console.log('fb', this.test);
    console.log('fb', this.dd);
    this.assets_show();
  }
  assets_show() {
    this.api.get_access_token('mdata_show').subscribe(token => {
      this.api.assets_show(token, this.id).subscribe((response: any) => {
        console.log('response', response);
        this.show_asset = response.data;
      },
      (error: any) => {
        alert(error.error['message']);
      });
    });
  }
}
