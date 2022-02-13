import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";

export function UpdateExpression(node,source,scope){
  node=node.firstChild;
  console.log(node);
  let v=CompileFunctions.get(node,source)(node,source,scope);
  if(!v.type.isNumeric()){
    throw source.createError("Diese Operation funktioniert nur mit Zahlen, aber nicht mit einem '"+v.type.toString()+"'.",node);
  }
  let code=v.code;
  node=node.nextSibling;
  if(node.name==="UpdateOp"){
    code+=source.getText(node);
  }
  return {
    code: code,
    type: v.type
  };
}