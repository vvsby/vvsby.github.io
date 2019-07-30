# json-to-class-app
Application which convert json to the class array.

<b>Get from url</b> - enter url to the server with <i>'Access-Control-Allow-Origin: *'</i> then click button.
Application will read json from response, insert it in <i>JSON for convert</i>, convert in TypeScript classes.

<b>First Class Name</b> (default: FirstClass) - name of the parent class. 

<b>Duplicate Names Template</b> (default: MustBeRenaimed) - if tree of properties contain duplicates, 
then for all new classes with duplicate names class names will be renamed: [Duplicate Names Template][duplicate name].

<b>Tab</b> (default: 2 spaces - '  ') - formating result code with tab.

<b>Use interfaces?</b> (default: true) - create interfaces and classes or only classes. 

<b>JSON for convert</b> (default: previous JSON) - JSON which we want to convert.
You can format or minimize your json (<i>Format</i> or <i>Compact json data</i>).

<b>Result</b> - result text which contain full list of interfaces and/or classes and can be copied to clipboard by:
<b>Copy result</b> button or file copy icon.


<b>Convert</b> button  - will start converting JSON from <b>JSON for convert</b> field.

You can test this application on: https://json-to-class.000webhostapp.com/
