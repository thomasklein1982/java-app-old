import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";
import { TypeParameter } from "./TypeParameter";

export function TypeParameters(node,source,scope){
  node=node.firstChild;
  let typeParameters={};
  while(node.name==="TypeParameter"){
    let tp=TypeParameter(node,source,scope);
    if(typeParameters[tp.name]===undefined){
      typeParameters[tp.name]=tp;
    }else{
      throw source.createError("Doppelter Typ-Parameter '"+tp.name+"'.",node);
    }
    node=node.nextSibling;
    if(!node) break;
    if(node.name===","){
      node=node.nextSibling;
    }
  }
  console.log(typeParameters);
  return {
    name: typeParameters
  }
}