

export function defineObject(datatypes){
  let m={
    a: {},
    c: [
      {
        params: [],
        exec: function(){
          return new Blox.Object();
        }
      }
    ],
    m: {
      equals: {
        info: "Prueft, ob dieses und das angegebene Objekt identisch sind.",
        params: [datatypes.object],
        returns: datatypes.boolean,
        exec: function(a){
          return this===a;
        }
      },
      toString: {
        info: "Wandelt das Objekt in einen String um.",
        params: [],
        returns: datatypes.String,
      }
    }
  }
  datatypes.Object.define(null,"'Object' ist die grundlegende Klasse in Java: Jede andere Klasse ist eine Unterklasse von 'Object'.",m);
}