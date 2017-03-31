var input;
var ands;
var enter = [];
var stack = [];
var exit_ = [];
var wynik;
var result =[];
function setup() {
  noCanvas();
  input=createInput();
  input.id("input");
  input.parent("content")
  input.changed(calculate);
  wynik=createP("wynik: ");
  wynik.class("txt")
  wynik.parent("content")
}

function calculate() {
  enter=[];
  var s = input.value();

// - - - - - - - - - - -VALIDATE STRING   - - - - - - - - - - - - - - - - - - //
  var ifpass = false;
  for(var i=0 ; i<s.length ; i++) {
   if(
     s[i]=="(" && !Number(s[i+1]) && s[i+1] !="0"   ||
     !Number(s[i]) && s[i]!="0" && s[i+1]==")"
    // !Number(s[i]) && s[i]!="0" && !Number(s[i+1]) && s[i+1]!="0"
     //!Number(s[i]) && s[i]!="0" && s[i]!=")"&& s[i]!="("&& s[i+1]!=")"&& s[i+1]!="(" && !Number(s[i+1]) && s[i+1]!="0"
   ) {
        ifpass = true;
    }
  }

  if(!Number(s[0]) && s[0]!="0" && s[0] !="(" || ifpass){
    wynik.html("Błąd");
  } else {




// - - - - - - - - - - - MAKE LIST TABLE  - - - - - - - - - - - - - - - - - - //


    ands = splitTokens(input.value(),['-','+','*','/','^','(',')','|']);
    var i = 0; //index for operands
    var j = 0; //index for operators


    // -- FOR FIRST CHARS
    while(s[j]=="(") {
      enter.push(s[j]);
      j++;
    }

    while(i<ands.length-2 || j<s.length) {
      //  -------- ADD OPERAND
        enter.push(Number(ands[i]));
        i++;

        //  -------  ADD OPERATOR
        do {
            while((Number(s[j])||s[j]=="0") && (Number(s[j+1])||s[j+1]=="0") && j<s.length-1) {
                j++;
            }
            if(!Number(s[j]) && s[j]!="0") {

              if(s[j]=="-" || s[j]=="+") {
                enter.push(s[j]={ator:s[j], pow:0});
              }
              if(s[j]=="*" || s[j]=="/") {
                enter.push(s[j]={ator:s[j], pow:1});
              }
              if(s[j]=="^") {
                enter.push(s[j]={ator:s[j], pow:2});
              }
              if(s[j]==")" || s[j]=="(") {
                enter.push(s[j]);
              }

            }
            j++;
        } while(j<s.length && !Number(s[j]) && s[j]!="0");
    }





// - - - - - - - - -  MAKE REVERSE POLISH NOTATION   ( POSTFIX ) - - - - - -  //

  stack = [];
  exit_ = [];

  for(var i=0 ; i<enter.length ; i++) {
//-------ROZPATRYWUJEMY POJEDYNCZY SYMBOL Z WEJŚCIA


    if(Number(enter[i]) || enter[i]=="0") {
      //-----DODAJ DO WYJŚCIA, JEŚLI JEST LICZBĄ
      exit_.push(enter[i]);
    } else
     if(enter[i]=="(") {
      //--- WŁÓŻ NA STOS, JEŚLI JEST LEWYM NAWIASEM
      stack.push(enter[i]);
    } else
     if(enter[i]==")") {
      //JEŚLI JEST PRAWYM NAWIASEM
        while(stack.length>0 && stack[stack.length-1]!="(") {
          exit_.push(stack[stack.length-1]);
          stack.pop();
        }
        if(stack[stack.length-1]=="(") stack.pop()
    } else
     if(!Number(enter[i]) && enter[i]!="0" && enter[i]!="(" && enter[i]!=")") {
      //------DODAJ NA STOS JEŚLI JEST OPERATOREM

         while(stack.length>0 && stack[stack.length-1].pow>=enter[i].pow) {  //nie działa :((()
            console.log("wyjmij ostatni element ze stosu i dodaj do wyjścia (niżej)");
            console.log(stack[stack.length-1]);
            exit_.push(stack[stack.length-1]);
            stack.pop()
          }
          //Dodaj bieżący element na stos
          stack.push(enter[i]);

      }
    }

    // JESLI NIE MA WIĘCEJ SYMBOLI DO PRZECZYTANIA
    while(stack.length>0) {
      exit_.push(stack[stack.length-1]);
      stack.pop();
    }






// - - - - - - - - CALCULATE RESULT - - - - - - - - - - - - - - - - - - - - - //
  result = [];
  for(var i=0 ; i<exit_.length ; i++) {

    var e = exit_[i]
    if(Number(e) || e=="0") {
      result.push(e)
    } else if(e.ator=="-") {
      var last = result[result.length-1];
      var lastest = result[result.length-2];
      result.pop();
      result.pop();
      result.push(lastest-last)
    } else if(e.ator=="+") {
      var last = result[result.length-1];
      var lastest = result[result.length-2];
      result.pop();
      result.pop();
      result.push(lastest+last)
    } else if(e.ator=="*") {
      var last = result[result.length-1];
      var lastest = result[result.length-2];
      result.pop();
      result.pop();
      result.push(lastest*last)
    } else if(e.ator=="/") {
      var last = result[result.length-1];
      var lastest = result[result.length-2];
      result.pop();
      result.pop();
      result.push(lastest/last)
    } else if(e.ator=="^") {
      var last = result[result.length-1];
      var lastest = result[result.length-2];
      result.pop();
      result.pop();
      result.push(Math.pow(lastest,last))
    }
  }
  wynik.html("wynik: "+result[0])


  }
}

// NUMBER(X) ZWRACA PRAWDĘ  <=> X JEST CYFRĄ OPRÓCZ ZERA
// !NUMBER(X) ZWRACA PRAWDĘ  <=> X JEST ZNAKIEM I ZEREM
