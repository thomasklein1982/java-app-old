import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";
import { TypeBound } from "./TypeBound";

export function TypeParameter(node,source,scope){
  node=node.firstChild;
  let name;
  let superclazz;
  if(node.name==="Definition"){
    name=source.getText(node);
    node=node.nextSibling;
  }
  if(node && node.type.isError){
    throw source.createError("Syntax-Fehler",node);
  }
  if(node && node.name==="TypeBound"){
    superclazz=TypeBound(node,source,scope);
  }
  return {
    name, superclazz
  }
}