import { Component, OnInit, ViewChild, ElementRef, DoCheck } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpParams, HttpResponse, HttpEventType, HttpHeaders, HttpRequest, HttpClient } from '@angular/common/http';
import { NgForm, FormGroup, FormGroupDirective, Validators, FormBuilder, FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

export interface Dep {
  id: number;
  nameeng: string;
  nameshoteng: string;
  nameshotth: string;
  nameth: string;
}
@Component({
  selector: 'app-asset-edit',
  templateUrl: './asset-edit.component.html',
  styleUrls: ['./asset-edit.component.scss']
})
// export class AssetEditComponent implements OnInit, DoCheck {
export class AssetEditComponent implements OnInit {
  id: any;
  @ViewChild('fileupload') file;
  dep_item: Dep[];
  filtered_dep_item: Observable<Dep[]>;
  pictures = [];
  selectedFile: Array<File> = [];
  errorPic: boolean;
  errorPicNum: boolean;
  picCtrl: FormControl;
  showButton: any;
  files: Array<File> = [];  flow: any;
  get_access_item: any;
  item_format: any = [];
  dynamic_form: FormGroup = new FormGroup({});
  image: any = [];
  Is_image: boolean;
  file_item: any;
  sub_asset_length: any;
  sub_asset_item: any = [];
  Isfinish: any;
  image_id: any = [];
  image2: any = [];
  showButton2: any;
  Is_sub_asset_image: boolean;
  subpictures: any = [];
  selectedFile2: Array<File> = [];
  errorPicNum2: boolean;
  picCtrl2: FormControl;
  errorPic2: boolean;
  imagearray: any = [];
  form_template: any = [
    {
      type: 'textBox',
      label: 'Name',
    },
    {
      type: 'number',
      label: 'Age'
    },
    {
      type: 'select',
      label: 'favorite book'
    }
  ];
  myFormGroup: FormGroup = new FormGroup({});
  myFormGroup2: FormGroup;
  myFormGroup3: FormGroup;
  constructor(
                private datePipe: DatePipe,
                private location: Location,
                private api: ApiService,
                private router: Router,
                private _DomSanitizer: DomSanitizer,
                private route: ActivatedRoute,
              ) {
                  this.route.queryParams.subscribe((params) => {
                    this.id = params['id'];
                  });
                  this.picCtrl = new FormControl();
                  this.picCtrl.setErrors({ 'incorrect': true });
                  this.picCtrl2 = new FormControl();
                  this.picCtrl2.setErrors({ 'incorrect': true });
                  this.dynamic_form = new FormGroup({
                      add_date: new FormControl('', Validators.required),
                      mdata_name: new FormControl('', Validators.required),
                      holder_fund: new FormControl('', Validators.required),
                      source: new FormControl(''),
                      storage: new FormControl(''),
                      detail: new FormControl(''),
                      pic_id: new FormControl(''),
                      price: new FormControl('', Validators.required),
                      sub_asset_name: new FormControl('', Validators.required),
                      sub_asset_detail: new FormControl('', Validators.required),
                      sub_asset_serial_number: new FormControl('', Validators.required)
                  });
                  this.get_access_by_id();
                  this.get_holderfund();
                }

  ngOnInit() {
    const label = {};
    const type = {};
    const test = new FormControl('sdfg');
    this.form_template.forEach(input_template => {
      console.log('input_template', input_template);
      type[input_template.type] = new FormControl('');
      label[input_template.label] = new FormControl('');
    });
    this.myFormGroup2 = new FormGroup(type);
    this.myFormGroup3 = new FormGroup(label);
    this.myFormGroup.addControl('sss', this.myFormGroup2);
    this.myFormGroup.addControl('sss6', this.myFormGroup3);
    // this.myFormGroup.addControl('a2', test);
    console.log(this.myFormGroup);
    this.dynamic_form.addControl('asdfb', this.myFormGroup);
    console.log('dynamic_form', this.dynamic_form);
  }
  get_access_by_id () {
    // this.image = [];
    this.api.get_access_token('mdata_byid').subscribe(token => {
      this.api.get_access_by_id(token, this.id).subscribe((response: any) => {
        this.get_access_item = response.data;
        console.log('this.get_access_item', this.get_access_item[0].holder_fund);
        for (let i = 0; i < this.get_access_item.length; i++) {
          for (let p = 0; p < this.get_access_item[i].holder_fund.length; p++) {
            this.dynamic_form.controls['holder_fund'].setValue(this.get_access_item[i].holder_fund[p]);
          }
          for (let q = 0; q < this.get_access_item[i].property.length; q++) {
            this.get_sub_asset_by_id(q, this.get_access_item[i].item_id[0].item_id, this.get_access_item[i].property[q].property_id);
          }
          const splitdatetime = this.get_access_item[i].add_date.split(' ');
          this.get_access_item[i].add_date = splitdatetime[0];
          this.file_item = this.get_access_item[i].file;
          this.api.get_access_token('view_picture').subscribe(token1 => {
            if (this.get_access_item[i].picture_id.length > 0) {
              this.Is_image = true;
              for (let j = 0; j <  this.get_access_item[i].picture_id.length; j++) {
                const picId = this.get_access_item[i].picture_id[j];
                const safe = this._DomSanitizer.bypassSecurityTrustUrl('./assets/blank.png');
                let imgarr = { img: safe, id: picId.picture_id };
                const params = new HttpParams()
                .append('delete_token', 'n');
                this.api.get_viewpicture(token1, this.get_access_item[i].picture_id[j].picture_id, params).subscribe((res: any) => {
                  if (i === (this.get_access_item[i].picture_id.length - 1)) {
                    this.delete_token(token);
                  } if (res.status === 'failed') {
                    const temp = this._DomSanitizer.bypassSecurityTrustUrl('./assets/blank.png');
                    imgarr = { img: temp, id: picId.picture_id };
                    this.image.push(imgarr);
                  } else {
                    const blob = new Blob([res], {
                      type: res.type
                    });
                    const urlCreator = window.URL;
                    const pics = this._DomSanitizer.bypassSecurityTrustUrl(
                      urlCreator.createObjectURL(blob));
                      imgarr = { img: pics, id: picId.picture_id };
                      this.image.push(imgarr);
                      if (this.image.length >= 5) {
                        this.showButton = false;
                      }
                      // console.log('this.image', this.image);
                    }
                  });
                }
              } else {
                this.Is_image = false;
              }
            });
          }
        });
      });
    }
    get_sub_asset_by_id(m, item_id, property_id) {
      this.api.get_access_token('property_dialog').subscribe(token => {
        this.api.get_sub_asset_by_id2(
          token,
          item_id,
          property_id
        ).subscribe((response: any) => {
          if (response.status === 'successful') {
            // this.sub_asset_length = response.count_data;
            this.sub_asset_item[m] = response.data;
            this.Isfinish = true;
            console.log('mmmmmmmmm', m);
            for (let i = 0; i < this.sub_asset_item[m].length; i++) {
              for (let j = 0; j < this.sub_asset_item[m][i].property_img.length; j++) {
                console.log('this.sub_asset_item[i]', this.sub_asset_item);
                this.image_id[j] = this.sub_asset_item[m][i].property_img[j].img_id;
                this.api.get_access_token('view_img').subscribe(token1 => {
                  const picId2 = this.sub_asset_item[m][i].property_img[j];
                  const safe2 = this._DomSanitizer.bypassSecurityTrustUrl('./assets/blank.png');
                  let imgarr2 = { img2: safe2, id2: picId2.img_id };
                  this.api.show_sub_image(
                      token1,
                      this.image_id[j]
                    ).subscribe((res: any) => {
                      if (i === (this.sub_asset_item[m][i].property_img.length - 1)) {
                          this.delete_token(token);
                      } if (res.status === 'failed') {
                        const temp2 = this._DomSanitizer.bypassSecurityTrustUrl('./assets/blank.png');
                        imgarr2[j] = { img2: temp2, id2: picId2.img_id };
                        this.sub_asset_item[m][i].image2 = imgarr2;
                      } else {
                        this.showButton2 = true;
                        const blob2 = new Blob([res], {
                          type: res.type
                        });
                        const urlCreator2 = window.URL;
                        const pics2 = this._DomSanitizer.bypassSecurityTrustUrl(
                          urlCreator2.createObjectURL(blob2));
                          imgarr2 = { img2: pics2, id2: picId2.img_id };
                          this.sub_asset_item[m][i].image2 = imgarr2;
                          // console.log('this.image2', this.image2);
                          if (this.sub_asset_item[m][i].image2.length >= 5) {
                            this.showButton2 = false;
                          }
                      }
                      });
                    });
              }
            }
            console.log('this.sub_asset_item', this.sub_asset_item);
          }
        });
      });
    }
  get_holderfund() {
    this.api.get_access_token('get_dep').subscribe(token => {
      this.api.get_holderfund(token).subscribe((response: any) => {
        if (response.status === 'successful') {
          this.dep_item = response.data;
          console.log('this.dep_item.slice()', this.dep_item.slice());
          this.holder_fund_change();
        } else {
          alert('Failed. Holder fund');
        }
      });
    });
  }
  holder_fund_change () {
    // alert('เข้า3');
    this.filtered_dep_item = this.dynamic_form.controls.holder_fund.valueChanges
    .pipe(
      startWith<string | Dep>(''),
      map(value => typeof value === 'string' ? value : value.nameth),
      map(nameth => nameth ? this._filter(nameth) : this.dep_item.slice())
    );
    console.log('this.filtered_dep_item', this.filtered_dep_item);
  }
  // async displayFn2(): Promise<any> {
  //   try {
  //     await this.get_access_by_id();
  //     return this.displayFn();
  //   } catch (error) {
  //     alert(error);
  //   }
  // }
  displayFn(data?: Dep): string | undefined {
    console.log('data', data);
  return data ? data.nameth : undefined;
  }
  _filter(value: string): Dep[] {
    // alert('เข้า5');
    console.log('value', value,   this.dynamic_form.controls.holder_fund.value);
    const filterValue = value.toLowerCase();
    return this.dep_item.filter(option => option.nameth.toLowerCase().indexOf(filterValue) === 0);
  }
  // ngDoCheck() {
  //   console.log('DoCheck');
  // }
  check_put_acess(f) {
  // this.form_template.forEach(input_template => {
  //   console.log('input_template', input_template);
  //   type[input_template.type] = new FormControl('');
  //   label[input_template.label] = new FormControl('');
  // });
    console.log('ffffffff', f);
    console.log('f.value.asdfb', f.value.asdfb);
    for (const test of Object.values(f.value.asdfb)) {
      console.log('test', test);
    }
    if ((f.value.add_date === '' || f.value.add_date === undefined || f.value.add_date === null)
        && (f.value.mdata_name === '' || f.value.mdata_name === undefined || f.value.mdata_name === null)
        && (f.value.price === '' || f.value.price === undefined || f.value.price === null)) {
          return alert('กรุกรุณากรอกข้อมูลช่อง * ให้ครบ');
    } else if (f.value.add_date === '' || f.value.add_date === undefined || f.value.add_date === null) {
      return alert('กรุณาระบุวันที่');
    } else if (f.value.mdata_name === '' || f.value.mdata_name === undefined || f.value.mdata_name === null) {
      return alert('กรุณาระบุชื่อครุภัณฑ์');
    } else if (f.value.price === '' || f.value.price === undefined || f.value.price === null) {
      return alert('กรุณาระบุราคา');
    } else {
      if (confirm('ยืนยันการแก้ไขครุภัณฑ์')) {
        this.put_access(f);
      }
    }
  }
  reset() {
    this.dynamic_form.controls['mdata_name'].setValue('');
    this.dynamic_form.controls['add_date'].setValue('');
    this.dynamic_form.controls['holder_fund'].setValue('');
    this.dynamic_form.controls['source'].setValue('');
    this.dynamic_form.controls['storage'].setValue('');
    this.dynamic_form.controls['detail'].setValue('');
    this.dynamic_form.controls['price'].setValue('');
  }
  put_access(f) {
    this.api.open_loading();
    const price_transform = (f.directives[6].value).replace(/,/g, '');
    this.dynamic_form.controls['price'].setValue(price_transform);
    const date_transform = this.datePipe.transform(f.directives[1].value, 'yyyy-MM-dd');
    this.dynamic_form.controls['add_date'].setValue(date_transform);
    // console.log('ffffffff', f.value.holder_fund.nameth);
    this.api.get_access_token('edit_asset').subscribe(token => {
      this.api.put_access(
        token,
        this.id,
        f.value.add_date,
        f.value.mdata_name,
        f.value.detail,
        f.value.price,
        f.value.source,
        f.value.holder_fund.id,
        f.value.storage
        ).subscribe((response: any) => {
          if (response.status === 'successful') {
            if (this.files.length > 0) {
              this.uploade_file_asset();
             } else {
               if (this.selectedFile.length > 0) {
                 this.add_picture();
               } else {
                 this.api.loading.close();
                 alert('แก้ไขครุภัณฑ์สำเร็จ');
                 this.router.navigate(['/asset_detail'], { queryParams: { id: this.id } });
               }
              }
         }
      },
    (error: any) => {
      this.api.loading.close();
      alert(error.error['message']);
    });
    });
  }
  uploade_file_asset() {
    // console.log('this.selectedFile', this.selectedFile);
    this.api.get_access_token('upload_asset').subscribe(token => {
      this.api.uploade_file_asset(token, this.id, this.files).subscribe((response: any) => {
        if (response.status === 'successful') {
          if (this.selectedFile.length > 0) {
            this.add_picture();
          } else {
            this.api.loading.close();
            alert('แก้ไขครุภัณฑ์สำเร็จ');
            return this.router.navigate(['/asset_detail'], { queryParams: { id: this.id } });
          }
        }
      });
    });
  }
  delete_token(params) {
      this.api.get_access_token('delete_token').subscribe(token => {
          this.api.delete_token(token, params).subscribe();
      });
  }
  deletepic_api(id, j) {
    // console.log('jjjj', j);
    this.api.get_access_token('delete_picture').subscribe(token => {
      this.api.delete_pic_asset(token, id).subscribe((response: any) => {
        if (response.status === 'successful') {
          alert('ลบรูปสำเร็จ');
          this.image.splice(j, 1);
          this.showButton = true;
          // console.log('this.image', this.image);
          // this.get_access_by_id();
        }
      },
    (error: any) => {
      alert(error.error['message']);
    });
    });
  }
  onFileChanged(event) {
    // console.log('this.selectedFile', this.selectedFile);
    const pattern = /image-*/;
    const temp = <Array<File>>event.target.files;
    if ((temp.length * 1) + (this.selectedFile.length * 1) + (this.image.length * 1) > 5) {
      return (this.errorPicNum = false);
    }
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].type.match(pattern)) {
        // console.log('temp', temp);
        this.selectedFile.push(temp[i]);
      }
    }
    this.errorPic = true;
    this.setPicErr();
    let reader: FileReader;
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].type.match(pattern)) {
        reader = new FileReader();
        reader.readAsDataURL(temp[i]);
        reader.onload = (res: any) => {
          this.pictures.push(res.target.result);
        };
      }
    }
  }
  deletepic(id) {
    const file1 = Array.prototype.slice.call(this.selectedFile, 0, id);
    const file2 = Array.prototype.slice.call(this.selectedFile, id + 1, this.selectedFile.length);
    this.selectedFile = [];
    for (let i = 0; i < file1.length; i++) {
      this.selectedFile.push(file1[i]);
    }
    for (let j = 0; j < file2.length; j++) {
      this.selectedFile.push(file2[j]);
    }
    this.pictures.splice(id, 1);
    this.setPicErr();
  }
  setPicErr() {
    if (this.selectedFile.length > 5) {
      this.errorPicNum = false;
      this.picCtrl.setErrors({ 'incorrect': true });
    } else if ((this.selectedFile.length * 1) + (this.image.length * 1) === 0) {
      this.errorPic = false;
      this.picCtrl.setErrors({ 'incorrect': true });
    } else {
      this.errorPicNum = true;
      this.picCtrl.setErrors(null);
    }
    if ((this.selectedFile.length * 1) + (this.image.length * 1) >= 5 ) {
      this.showButton = false;
    } else {
      this.showButton = true;
    }
  }
  add_file() {
    this.file.nativeElement.click();
  }
  fileChange(files: any) {
    if ((files.length * 1) + (this.file_item.length * 1) > (5 - this.files.length)) {
      this.file.nativeElement.value = '';
      alert('สามารถแนบเอกสารได้สูงสุด 5 ไฟล์เท่านั้น.');
    } else {
      for (let i = 0; i < files.length; i++) {
        this.files.push(files[i]);
      }
      this.file.nativeElement.value = '';
    }
    // console.log('file', this.files);
  }

  remove_new_file(file, index) {
      this.files.splice(index, 1);
  }
  deleteFile (id, l) {
    this.api.get_access_token('delete_file').subscribe(token => {
      this.api.deleteFile(token, id).subscribe((response: any) => {
        if (response.status === 'successful') {
          this.file_item.splice(l, 1);
          alert('ลบเอกสารแนบสำเร็จ');
        }
      },
    (error: any) => {
      this.api.loading.close();
      alert(error.error['message']);
    });
    });
  }
  add_picture() {
    // console.log('this.selectedFile', this.selectedFile);
    this.api.get_access_token('editPic').subscribe(token => {
      this.api.add_picture(token, this.id, this.selectedFile).subscribe((response: any) => {
        if (response.status === 'successful') {
          this.api.loading.close();
          alert('แก้ไขครุภัณฑ์สำเร็จ');
          return this.router.navigate(['/asset_detail'], { queryParams: { id: this.id } });
        }
      },
    (error: any) => {
      this.api.loading.close();
      alert(error.error['message']);
    });
    });
  }
  back() {
    this.location.back();
  }
  onFileChanged2(event) {
    // console.log('this.selectedFile', this.selectedFile);
    const pattern = /image-*/;
    const temp = <Array<File>>event.target.files;
    if ((temp.length * 1) + (this.selectedFile2.length * 1) + (this.image2.length * 1) > 5) {
      return (this.errorPicNum = false);
    }
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].type.match(pattern)) {
        // console.log('temp', temp);
        this.selectedFile2.push(temp[i]);
      }
    }
    this.errorPic = true;
    this.setPicErr2();
    let reader: FileReader;
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].type.match(pattern)) {
        reader = new FileReader();
        reader.readAsDataURL(temp[i]);
        reader.onload = (res: any) => {
          this.subpictures.push(res.target.result);
        };
      }
    }
  }
  deletepic2(id) {
    const file1 = Array.prototype.slice.call(this.selectedFile2, 0, id);
    const file2 = Array.prototype.slice.call(this.selectedFile2, id + 1, this.selectedFile2.length);
    this.selectedFile2 = [];
    for (let i = 0; i < file1.length; i++) {
      this.selectedFile2.push(file1[i]);
    }
    for (let j = 0; j < file2.length; j++) {
      this.selectedFile2.push(file2[j]);
    }
    this.subpictures.splice(id, 1);
    this.setPicErr2();
  }
  setPicErr2() {
    if (this.selectedFile2.length > 5) {
      this.errorPicNum2 = false;
      this.picCtrl2.setErrors({ 'incorrect': true });
    } else if ((this.selectedFile.length * 1) + (this.image.length * 1) === 0) {
      this.errorPic2 = false;
      this.picCtrl2.setErrors({ 'incorrect': true });
    } else {
      this.errorPicNum2 = true;
      this.picCtrl2.setErrors(null);
    }
    if ((this.selectedFile2.length * 1) + (this.image2.length * 1) >= 5 ) {
      this.showButton2 = false;
    } else {
      this.showButton2 = true;
    }
  }
}
