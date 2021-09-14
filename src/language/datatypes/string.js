export function defineString(datatypes){
  let m={
    a: {
  
    },
    c: {
      params: [],
      info: "Erzeugt einen neuen leeren String.",
      exec: function(){
        return new String();
      }
    },
    m: {
      
    }
  }
  datatypes.String.define(datatypes.Object,"Ein String ist eine Zeichenkette.",m);
}
