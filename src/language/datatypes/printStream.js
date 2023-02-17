import { createMethod } from "../helper/createMethod";

export function definePrintStream(clazz){
  createMethod({
    name: "println",
    args: [
      {
        name: "text",
        type: "String",
        info: "Der Wert, der ausgegeben werden soll."
      }
    ],
    info: "Gibt den Text aus und macht einen Zeilenumbruch."
  },clazz,false,false);
  console.log("print stream");
}