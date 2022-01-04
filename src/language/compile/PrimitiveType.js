export function PrimitiveType(node,source,scope){
  let code;
  let name=source.src.substring(node.from,node.to);
  let type=scope.getPrimitiveTypeByName(name);
  if(!type){
    throw (source.createError("Es tut mir leid, der primitive Datentyp '"+name+"' ist nicht implementiert.",node));
  }
  return {
    code: name,
    type
  }
}