var input;
var nums=[];
var allChars;
var ators=[];
var ands;
var postfix=[];

function setup() {
  noCanvas();
  input=createInput();
  wynik=createP('');
  input.changed(calculate);
}

function calculate() {
  var s=input.value();
  ands=splitTokens(s,['-','+','*','/','^']);
  allChars=split(s,'');
  for(var i=0 ; i<allChars.length ; i++) {
    var a=allChars[i];
    if(a=='-' || a=='+' || a=="*" || a=="/" || a=="^") {
      ators.push(a);
    }
  }
    console.log(ators);
    console.log(ands);

    for(var i=0 ; i<ands.length+ators.length ; i++) {

    }

    console.log(postfix)
}
