export function defineString(datatypes){
  let m={
    a: {
  
    },
    c: [
      {
        params: [],
        info: "Erzeugt einen neuen leeren String.",
        exec: function(){
          return new String();
        }
      },
      {
        params: [datatypes.string],
        info: "Erzeugt einen String, der aus den gleichen Zeichen besteht wie der übergebene String.",
        exec: function(s){
          return new String(s);
        }
      },
      {
        params: [{
          type: datatypes.char,
          dim: 1
        }],
        info: "Erzeugt einen neuen String aus dem char-Array.",
        exec: function(charArray){
          let t="";
          for(let i=0;i<charArray.length;i++){
            t+=charArray[i];
          }
          return t;
        }
      }
    ],
    m: [
      
    ]
  }
  datatypes.String.define(datatypes.Object,"Ein String ist eine Zeichenkette.",m);
}
