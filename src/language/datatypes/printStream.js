import { Type } from "../../classes/Type";

export function definePrintStream(datatypes){
  let m={
    m: {
      println: {
        info: "Gibt den angegebenen Text aus und macht anschließend einen Zeilenumbruch.",
        params: [{name: "s", type: null}],
        exec: function(t){
          console.log(t);
        }
      }
    }
  };
  datatypes.PrintStream.define(datatypes.Object,"keine Beschreibung vorhanden",m,true);
}