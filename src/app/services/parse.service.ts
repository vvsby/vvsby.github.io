import { Injectable } from '@angular/core';
import { TabForSelect, ClassField, Row } from '../classes/classes';
import { HighlightResult } from 'ngx-highlightjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ParseService {

  tab = '  ';
  badSymbolsAlertMsg = 'You need to check JSON names. Some names with bad characters.';
  regexp = new RegExp('\\W+');
  withInterfaces = true;
  alertMsg = false;
  firstClassName = 'FirstClass';
  templateForDuplicates = 'MustBeRenaimed';
  otputText: any[];
  classArray: any[] = [];
  classNamesArray: string[] = [];
  response: HighlightResult;
  arrayOfClasses: ClassField[];
  constructor(
    public http: HttpClient) {
    this.initArrays();

  }
  /**
   * Parse and convert input text into the final result
   * @param inputText text for parsing
   */
  getText(inputText: string) {
    let parsed;
    try {
      parsed = JSON.parse(inputText);
      this.saveToLS(inputText);
    } catch (err) {
      alert(err);
    }
    if (parsed) {
      this.initArrays();
      this.createClassRow(this.getObjectFromArray(parsed), this.checkClassName(this.firstClassName));
      const showResult = this.getOutputTexFromArray(this.arrayOfClasses); // str;
      return showResult;
    }
    return '';
  }
  /**
   * Return updated text after changing parameters.
   */
  updateText() {
    return this.getOutputTexFromArray(this.arrayOfClasses);
  }
  getObjectFromArray(obj) {
    return Array.isArray(obj) ? this.getObjectFromArray(obj.shift()) : obj;
  }
  /**
   * Return input string with first big letter
   * @param str input string
   */
  firstBigLetter(str: string) {
    const response = str[0].toUpperCase() + str.substring(1, str.length);
    return response;
  }
  /**
   * Return string type of the object
   * @param obj input object
   */
  getType(obj) {
    const type = typeof obj;
    if (type !== 'object' && type !== 'undefined') {
      return type;
    } else if (obj === null || obj === undefined) {
      return 'any';
    } else if (Array.isArray(obj)) {
      return 'array';
    }
    return 'object';
  }
  /**
   * Main function for parsing
   * @param obj input object for parsing
   * @param parentObject input parent object for parsing (optional |used for parsing arrays)
   */
  goByFields(obj, parentObject?) {
    if (!Array.isArray(obj)) {
      return this.goByFieldsForObject(obj, parentObject);
    } else {
      return this.goByFieldsForArray(obj);
    }
  }
  /**
  * Parse arrays
  * @param obj input object for parsing
  * @param parentObject input parent object for parsing (optional |used for parsing arrays)
  */
  goByFieldsForArray(obj) {
    const typeOfFirstElement = this.goByFields(obj[0]);
    if (typeOfFirstElement !== 'any') {
      return typeOfFirstElement + '[]';
    } else {
      let typeForResponse = 'any';
      obj.forEach(element => {
        const typeOfNextElement = this.goByFields(element);
        if (typeOfNextElement !== 'any') {
          typeForResponse = typeOfNextElement;
        }
      });
      return typeForResponse + '[]';
    }
  }
  /**
   * Parse objects
   * @param obj input object for parsing
   * @param parentObject input parent object for parsing (optional |used for parsing arrays)
   */
  goByFieldsForObject(obj, parentObject?) {
    let response = '';
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (key) {
          const type = this.getType(obj[key]);
          if (type === 'any' && parentObject) {
            response += '  ' + key + ': ' + this.findTypeInParent(parentObject, key) + ';\r\n';
          } else {
            if (type !== 'object' && type !== 'array') {
              response += '  ' + key + ': ' + type + ';\r\n';
            } else if (type === 'array') {
              if (this.getType(obj[key][0]) === 'object') {
                const className = this.checkClassName(this.firstBigLetter(key) + 'Class');
                response += '  ' + key + ': ' + className + '[];\r\n';
                this.createClass(obj[key][0], className, obj[key]);
              } else if (this.getType(obj[key][0]) === 'array') { /* переделать */
                const text = this.getTypeFinal(obj[key], key);
                response += '  ' + key + ': ' + text + ';\r\n';
              } else {
                response += '  ' + key + ': ' + this.goByFields(obj[key][0], obj[key]) + '[]' + ';\r\n';
              }
            } else if (obj[key]) {
              const className = this.checkClassName(this.firstBigLetter(key) + 'Class');
              response += '  ' + key + ': ' + className + ';\r\n';
              this.createClass(obj[key], className, obj);
            } else {
              response += '  ' + key + ': any;\r\n';
            }
          }
        }
      }
      return response;
    } else {
      return obj ? typeof obj : 'any';
    }

  }
  /**
   * Main function for parsing
   * @param obj input object for parsing
   * @param parentObject input parent object for parsing (optional |used for parsing arrays)
   */
  goByFieldsRows(obj, parentObject?) {
    if (!Array.isArray(obj)) {
      return this.goByFieldsForObjectRows(obj, parentObject);
    } else {
      return [];
    }
  }
  /**
   * Parse objects
   * @param obj input object for parsing
   * @param parentObject input parent object for parsing (optional |used for parsing arrays)
   */
  goByFieldsForObjectRows(obj, parentObject?) {
    const response: Row[] = [];
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (key) {
          const type = this.getType(obj[key]);
          if (type === 'any' && parentObject) {
            response.push({ name: key.replace(' ', '_'), type: this.findTypeInParent(parentObject, key) });
          } else {
            if (type !== 'object' && type !== 'array') {
              response.push({ name: this.useQuotesForBadNames(key), type: type });
            } else if (type === 'array') {
              response.push(this.getTypeOfArray(obj, key));
            } else if (obj[key]) {
              const className = this.checkClassName(this.firstBigLetter(this.removeBadSymbols(key)) + 'Class');
              response.push({ name: this.useQuotesForBadNames(key), type: className });
              this.createClassRow(obj[key], className, obj);
            } else {
              response.push({ name: this.useQuotesForBadNames(key), type: 'any' });
            }
          }
        }
      }
      return response;
    } else {
      return [];
    }
  }
  getTypeOfArray(obj, key) {
    let response: { name: string, type: string };
    const childType = this.getType(obj[key][0]);
    if (childType === 'object') {
      const className = this.checkClassName(this.firstBigLetter(key) + 'Class');
      response = { name: this.useQuotesForBadNames(key), type: className + '[]' };
      this.createClassRow(obj[key][0], className, obj[key]);
    } else if (childType === 'array') {
      const text = this.getTypeFinalRow(obj[key], key);
      response = { name: this.useQuotesForBadNames(key), type: text };
    } else if (childType === 'any') {
      let tempType = '';
      for (let index = 0; index < obj[key].length; index++) {
        if (obj[key][index] && (typeof obj[key][index] !== 'object') && !Array.isArray(obj[key][index])) {
          const typeTemp = this.goByFields(obj[key][index], obj[key]);
          if (typeTemp !== 'any') {
            tempType = tempType === '' ? tempType : tempType + '[] | ';
            tempType = tempType.indexOf(typeTemp) > -1 ? tempType : tempType + typeTemp;
          }
        } else if (Array.isArray(obj[key][index])) {
          tempType = this.getTypeFinal(obj[key][index], index);
          break;
        } else if (obj[key][index]) {
          tempType = this.checkClassName(this.firstBigLetter(this.removeBadSymbols(key)) + 'Class');
          this.createClassRow(obj[key][index], tempType, obj[key]);
          break;
        }
      }
      tempType = tempType === '' ? 'any' : tempType;
      response = { name: this.useQuotesForBadNames(key), type: tempType + '[]' };
    } else {
      response = { name: this.useQuotesForBadNames(key), type: this.goByFields(obj[key][0], obj[key]) + '[]' };
    }
    return response;
  }
  useQuotesForBadNames(inputText: string) {
    if (this.findBadSymbols(inputText)) { this.alertMsg = true; }
    return this.findBadSymbols(inputText) ? `'` + inputText + `'` : inputText;
  }
  findBadSymbols(inputText: string) {
    const responseArray = inputText.match(this.regexp);
    return responseArray ? true : false;
  }
  removeBadSymbols(inputText: string) {
    const response = inputText.replace(this.regexp, '');
    return response;
  }
  /**
  * Parse arrays
  * @param obj input object for parsing
  * @param parentObject input parent object for parsing (optional |used for parsing arrays)
  */
  goByFieldsForArrayRows(obj) {
    const typeOfFirstElement = this.goByFields(obj[0]);
    if (typeOfFirstElement !== 'any') {
      return typeOfFirstElement + '[]';
    } else {
      let typeForResponse = 'any';
      obj.forEach(element => {
        const typeOfNextElement = this.goByFields(element);
        if (typeOfNextElement !== 'any') {
          typeForResponse = typeOfNextElement;
        }
      });
      return typeForResponse + '[]';
    }
  }
  /**
   * Create new class for the class array
   */
  createClass(obj, name: string, parent?) {
    const className = this.firstBigLetter(name);
    this.classNamesArray.push(className);
    let response = '';
    response = 'class ' + className + ' {\r\n';
    response += this.goByFields(obj, parent);
    response += '}';
    this.classArray[className] = response;
    return className;
  }
  /**
   * Create new class for the class array
   */
  createClassRow(obj, name: string, parent?) {
    const className = this.firstBigLetter(this.useQuotesForBadNames(name));
    this.classNamesArray.push(className);
    this.arrayOfClasses.push(new ClassField({ name: className, arrayOfRows: this.goByFieldsRows(obj, parent) }));
    return className;
  }
  /**
   * Get JSON data from URL
   */
  getFromUrl(url: string) {
    if (url) {
      try {
        this.http.get(url).subscribe(response => {
          const inputText = JSON.stringify(response);
          return inputText;
        });
      } catch (err) {
        alert(err);
        return null;
      }

    } else {
      alert('Empty URL!');
      return null;
    }
  }
  /**
   * Return classname with 'MustBeRenamed*' mask if class name was defined
   * @param name class name
   */
  checkClassName(name: string) {
    return this.classNamesArray.indexOf(name) < 0 ? name : this.checkClassName(this.templateForDuplicates + name);
  }
  /**
   * Initialize all arrays
   */
  initArrays() {
    this.classArray = [];
    this.classNamesArray = [];
    this.otputText = [];
    this.arrayOfClasses = [];
    this.alertMsg = false;
  }

  /**
   * Return type from other element in array
   * @param parentObject parent array
   * @param keyParent name property for type identification
   */
  findTypeInParent(parentObject?, keyParent?: string) {
    let type = 'any';
    if (Array.isArray(parentObject)) {
      parentObject.forEach(obj => {
        let response = '';
        response = this.goByFields(obj[keyParent]);
        if (response !== 'any') {
          type = response;
        }
      });
    }
    return type;
  }
  getTypeFinal(obj, name) {
    if (Array.isArray(obj)) {
      return this.getTypeFinal(obj[0], name) + '[]';
    }
    let string = 'any';
    if (obj && typeof obj === 'object') {
      string = this.createClass(obj, name + 'Class');
    } else {
      string = typeof obj;
    }
    return string;
  }
  getTypeFinalRow(obj, name) {
    if (Array.isArray(obj)) {
      return this.getTypeFinalRow(obj[0], name) + '[]';
    }
    let string = 'any';
    if (obj && typeof obj === 'object') {
      string = this.createClassRow(obj, name + 'Class');
    } else {
      string = typeof obj;
    }
    return string;
  }
  /**
   * Convert ClassField array into the result code
   * @param obj input ClassField array for convert
   */
  getOutputTexFromArray(obj: ClassField[]) {
    let str = '';
    if (this.alertMsg) {
      alert(this.badSymbolsAlertMsg);
    }
    obj.forEach(classRow => {
      if (this.withInterfaces) {
        str += 'export interface I' + classRow.name + '{\r\n';
        classRow.arrayOfRows.forEach(row => {
          str += this.tab + row.name + ': ' + row.type + ';\r\n';
        });
        str += '}\r\n\r\n';
      }
      str += 'export class ' + classRow.name + (this.withInterfaces ? (' implements I' + classRow.name) : '') + '{\r\n';
      classRow.arrayOfRows.forEach(row => {
        str += this.tab + row.name + ': ' + row.type + ';\r\n';
      });
      str += '\r\n' + this.tab + 'constructor(initObject?: ' + (this.withInterfaces ? 'I' : '') + classRow.name + ') {\r\n';
      classRow.arrayOfRows.forEach(row => {
        if (row.name.indexOf(`'`) > -1) {
          str += this.tab + this.tab + 'this[' + row.name + '] = initObject && initObject[' + row.name + '];\r\n';
        } else {
          str += this.tab + this.tab + 'this.' + row.name + ' = initObject && initObject.' + row.name + ';\r\n';
        }
      });
      str += this.tab + '}\r\n';
      str += '}\r\n\r\n';
    });
    return str;
  }
  /**
   * Save @inputText to the localstorage
   */
  saveToLS(inputText: string) {
    window.localStorage.setItem('jsonForConvert', inputText);
  }
  /**
   * Read input text from the localstorage
   */
  getFromLS() {
    if (window && window.localStorage) {
      return window.localStorage.getItem('jsonForConvert') || '';
    }
    return '';
  }
  /**
   * Copy text from code field to clipboard
   */
  copyTextToClipboard(text: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}

