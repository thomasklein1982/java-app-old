import { Clazz } from "../../classes/Clazz";
import { UIClazz } from "../../classes/UIClazz";
import { CompileFunctions } from "../CompileFunctions";
import { PrimitiveType } from "./PrimitiveType";

export function AssignmentExpression(node,source,scope){
  let code;
  node=node.firstChild;
  if(node.name!=="Identifier"){

  }
  let v=CompileFunctions.get(node,source)(node,source,scope);
  
  if(v && v.object && (v.object instanceof Clazz || v.object instanceof PrimitiveType || v.object instanceof UIClazz)){
    throw source.createError("Du kannst dem Datentyp '"+v.name+"' keinen Wert zuweisen.",node);
  }
  if(!v || !v.type){
    throw source.createError("Du kannst dem Ausdruck '"+v.name+"' keinen Wert zuweisen.",node);
  }
  node=node.nextSibling;
  if(node.name!=="AssignOp"){
    throw source.createError("'=' erwartet.",node);
  }
  node=node.nextSibling;
  let val=CompileFunctions.get(node,source)(node,source,scope);
  if(!val.type){
    throw source.createError("Dieser Ausdruck hat keinen Wert, der zugewiesen werden könnte.",node);
  }
  v.type.autoCastValue(val);
  if(!val.type.isSubtypeOf(v.type)){
    throw source.createError("Einer Variablen vom Typ '"+v.type+"' kann kein Wert vom Typ '"+val.type+"' zugewiesen werden.",node);
  }
  if(v.codeSet){
    code=v.codeSet+val.code+")";
  }else{
    code=v.code+"="+val.code;
  }
  if(v.local){
    code+=";eval('$locals["+JSON.stringify(v.name)+"]="+v.name+"');";
  }
  return {
    code
  }
}