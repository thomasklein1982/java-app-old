import { createMethod } from "../helper/createMethod";

export function defineMath(MathClazz,Java){
  MathClazz.name="Math";
  let methods=[];
  createMethod({
    name: "sqrt",
    info: "Liefert die Wurzel zurück.",
    returnType: 'double',
    args: [{name: "x", type: "double", info: "Die Zahl, aus der die Wurzel gezogen werden soll."}],
  },MathClazz,true,false,Java);

}
