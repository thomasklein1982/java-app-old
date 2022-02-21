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
  createMethod({
    name: "pow",
    info: "Liefert eine Potenz zurück.",
    returnType: 'double',
    args: [
      {name: "basis", type: "double", info: "Die Basis der Potenz."},
      {name: "exp", type: "double", info: "Der Exponent der Potenz."}
    ],
  },MathClazz,true,false,Java);
  createMethod({
    name: "abs",
    info: "Liefert den Betrag zurück.",
    returnType: 'double',
    args: [{name: "x", type: "double", info: "Die Zahl, deren Betrag bestimmt werden soll."}],
  },MathClazz,true,false,Java);

}
