import { Type } from "../../classes/Type";

export function definePrintStream(datatypes){
  let m={
    m: {
      println: {
        info: "Gibt den angegebenen Text aus und macht anschließend einen Zeilenumbruch.",
        versions: [
          {
            params: [{name: "s", type: new Type(datatypes.String,0)}],
            exec: function(t){
              console.log(t+" (String)");
            }
          },
          {
            params: [{name: "i", type: new Type(datatypes.Integer,0)}],
            exec: function(t){
              console.log(t+" (Integer)");
            }
          }
        ]
      }
    }
  };
  datatypes.PrintStream.define(datatypes.Object,"keine Beschreibung vorhanden",m,true);
}