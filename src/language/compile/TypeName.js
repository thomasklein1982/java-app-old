import { Type } from "../../classes/Type";

export function TypeName(node,source,scope){
  let name=source.src.substring(node.from,node.to);
  let clazz=scope.getClazzByName(name);
  if(!clazz){
    throw (source.createError("Es gibt keinen Datentypen namens '"+name+"'.",node));
  }
  return {
    type: new Type(clazz,0),
    code: name
  }
}