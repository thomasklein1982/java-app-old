import { CompileFunctions } from "../CompileFunctions";
import { Identifier } from "./Identifier";

export function AssignmentExpression(node,source,scope){
  let code;
  node=node.firstChild;
  if(node.name!=="Identifier"){

  }
  let v=CompileFunctions.get(node,source)(node,source,scope);
  
  node=node.nextSibling;
  if(node.name!=="AssignOp"){
    throw source.createError("'=' erwartet.",node);
  }
  node=node.nextSibling;
  let val=CompileFunctions.get(node,source)(node,source,scope);
  if(!val.type){
    throw source.createError("Es existiert kein Wert, der zugewiesen werden könnte (ich verstehe es selbst nicht ganz...).",node);
  }
  if(!val.type.isSubtypeOf(v.type)){
    throw source.createError("Einer Variablen vom Typ '"+v.type.name+"' kann kein Wert vom Typ '"+val.type.name+"' zugewiesen werden.",node);
  }
  code=v.code+"="+val.code;
  return {
    code
  }
}