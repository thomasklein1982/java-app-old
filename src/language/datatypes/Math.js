import { createMethod } from "../helper/createMethod";
import { createAttribute } from "../helper/createAttribute";

export function defineMath(MathClazz,Java){
  MathClazz.name="Math";
  let methods=[];
  createAttribute({
    name: "PI",
    info: "Die Kreiszahl PI = 3.1415...",
    type: 'double'
  },MathClazz,true,false,Java);
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
    name: "round",
    info: "Rundet kaufmaennisch.",
    returnType: 'int',
    args: [
      {name: "number", type: "double", info: "Die Zahl, die gerundet werden soll."}
    ],
  },MathClazz,true,false,Java);
  createMethod({
    name: "floor",
    info: "Rundet ab.",
    returnType: 'int',
    args: [
      {name: "number", type: "double", info: "Die Zahl, die gerundet werden soll."}
    ],
  },MathClazz,true,false,Java);
  createMethod({
    name: "ceil",
    info: "Rundet auf.",
    returnType: 'int',
    args: [
      {name: "number", type: "double", info: "Die Zahl, die gerundet werden soll."}
    ],
  },MathClazz,true,false,Java);
  createMethod({
    name: "abs",
    info: "Liefert den Betrag zurück.",
    returnType: 'double',
    args: [{name: "x", type: "double", info: "Die Zahl, deren Betrag bestimmt werden soll."}],
  },MathClazz,true,false,Java);
  createMethod({
    name: "sin",
    info: "Liefert den Sinus des Winkels im Bogenmaß zurück.",
    returnType: 'double',
    args: [{name: "x", type: "double", info: "Winkel im Bogenmaß."}],
  },MathClazz,true,false,Java);
  createMethod({
    name: "cos",
    info: "Liefert den Kosinus des Winkels im Bogenmaß zurück.",
    returnType: 'double',
    args: [{name: "x", type: "double", info: "Winkel im Bogenmaß."}],
  },MathClazz,true,false,Java);
  createMethod({
    name: "tan",
    info: "Liefert den Tangens des Winkels im Bogenmaß zurück.",
    returnType: 'double',
    args: [{name: "x", type: "double", info: "Winkel im Bogenmaß."}],
  },MathClazz,true,false,Java);
  createMethod({
    name: "asin",
    info: "Liefert den Winkel zwischen -PI/2 und +PI/2 zurück, der den angegebenen Sinus-Wert hat.",
    returnType: 'double',
    args: [{name: "x", type: "double", info: "Winkel im Bogenmaß."}],
  },MathClazz,true,false,Java);
  createMethod({
    name: "acos",
    info: "Liefert den Winkel zwischen 0 und PI zurück, der den angegebenen Kosinus-Wert hat.",
    returnType: 'double',
    args: [{name: "x", type: "double", info: "Winkel im Bogenmaß."}],
  },MathClazz,true,false,Java);
  createMethod({
    name: "atan",
    info: "Liefert den Winkel zwischen -PI/2 und +PI/2 zurück, der den angegebenen Tangens-Wert hat.",
    returnType: 'double',
    args: [{name: "x", type: "double", info: "Winkel im Bogenmaß."}],
  },MathClazz,true,false,Java);
  createMethod({
    name: "toRadians",
    isExtraFunction: true,
    info: "Wandelt einen Winkel im Gradmaß ins Bogenmaß um.",
    returnType: 'double',
    args: [{name: "x", type: "double", info: "Winkel im Gradmaß."}],
    jsName: "$toRadians"
  },MathClazz,true,false,Java);
  createMethod({
    name: "toDegrees",
    isExtraFunction: true,
    info: "Wandelt einen Winkel im Bogenmaß ins Gradmaß um.",
    returnType: 'double',
    args: [{name: "x", type: "double", info: "Winkel im Bogenmaß."}],
    jsName: "$toDegrees"
  },MathClazz,true,false,Java);
}
