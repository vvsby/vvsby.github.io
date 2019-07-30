import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TabForSelect } from 'src/app/classes/classes';
import { ParseService } from 'src/app/services/parse.service';

@Component({
  selector: 'app-header-form',
  templateUrl: './header-form.component.html',
  styleUrls: ['./header-form.component.css']
})
export class HeaderFormComponent implements OnInit {
  @Output() update = new EventEmitter<IHeaderForm>();
  @Output() byUrl = new EventEmitter<string>();
  headerForm = new FormGroup({
    url: new FormControl(''),
    firstClassName: new FormControl('FirstClass'),
    templateForDuplicates: new FormControl('MustBeRenaimed'),
    tab: new FormControl('  '),
    withInterfaces: new FormControl(true)
  });
  msgUrl = 'URL is not correct.';
  tabArrays: TabForSelect[] = [
    { text: '2 spaces', value: '  ' },
    { text: '4 spaces', value: '    ' },
    { text: 'tab', value: ' ' },
    { text: 'none', value: '' }
  ];

  constructor(
    public parseService: ParseService
  ) { }

  ngOnInit() {
  }
  onSubmit() {
    this.updateText();
  }
  updateText() {
    this.refreshParameters();
    this.update.next(this.headerForm.value);
  }
  refreshParameters() {
    this.parseService.templateForDuplicates = this.headerForm.value.templateForDuplicates;
    this.parseService.firstClassName = this.headerForm.value.firstClassName;
    this.parseService.tab = this.headerForm.value.tab;
    this.parseService.withInterfaces = this.headerForm.value.withInterfaces;
  }
  getFromUrl() {
    if (this.validURL(this.headerForm.value.url)) {
      this.byUrl.next(this.headerForm.value.url);
    } else {
      alert(this.msgUrl);
    }
  }
  validURL(url: string) {
    const pattern = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    return pattern.exec(url) && pattern.exec(url)[0] === url;
  }
}

class IHeaderForm {
  url: string;
  firstClassName: string;
  templateForDuplicates: string;
  tab: string;
  withInterfaces: boolean;
}
