
export class Row {
    name: string;
    type: string;
    constructor(obj?: Row) {
        this.name = obj.name || '';
        this.type = obj.type || '';
    }
}
export class ClassField {
    name: string;
    arrayOfRows: Row[];
    constructor(obj?: ClassField) {
        this.name = obj.name || '';
        this.arrayOfRows = obj.arrayOfRows || [];
    }
}
export class TabForSelect {
    text: string;
    value: string;
    constructor(obj?: TabForSelect) {
        this.text = obj.text || '';
        this.value = obj.value || '';
    }
}
