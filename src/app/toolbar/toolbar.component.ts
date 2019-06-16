import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor() { }
  @Output() toggle = new EventEmitter<boolean>();
  ngOnInit() {
  }
  toggleMenu() {
    this.toggle.emit(true);
  }
  showerr() {
    alert('Sorry! This feature is not available');
  }

}
