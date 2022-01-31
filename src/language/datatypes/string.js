import { createMethod } from "../helper/createMethod";

export function defineString(StringClazz,Java){
  StringClazz.name="String";
  let methods=[];
  createMethod({
    name: "length",
    info: "Liefert die Anzahl der Zeichen des Strings zurück.",
    returnType: 'int',
    jsName: "len"
  },StringClazz,false,false,Java);

}
