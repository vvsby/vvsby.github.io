import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ParseService } from '../../services/parse.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('code', { static: true }) codeElement: ElementRef;
  inputText: string;
  showResult = '';

  constructor(
    public http: HttpClient,
    public parseService: ParseService
  ) { }

  ngOnInit() {
    this.inputText = this.parseService.getFromLS();
  }
  ngAfterViewInit() { }

  copyTextToClipboard() {
    this.parseService.copyTextToClipboard(this.showResult);
  }
  getText() {
    this.showResult = this.parseService.getText(this.inputText);
  }
  getFromUrl(url: string) {
    const result = this.parseService.getFromUrl(url);
    this.inputText = result ? result : this.inputText;
    this.showResult = this.parseService.getText(this.inputText);
  }
  updateText() {
    this.showResult = this.parseService.updateText();
  }
}
