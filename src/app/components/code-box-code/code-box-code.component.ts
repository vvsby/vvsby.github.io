import { Component, OnInit, Input } from '@angular/core';
import { ParseService } from 'src/app/services/parse.service';

@Component({
  selector: 'app-code-box-code',
  templateUrl: './code-box-code.component.html',
  styleUrls: ['./code-box-code.component.css']
})
export class CodeBoxCodeComponent implements OnInit {

  @Input() text: string;

  constructor(
    public parseService: ParseService) { }

  ngOnInit() {
  }

  copyTextToClipboard() {
    this.parseService.copyTextToClipboard(this.text);
  }
}
