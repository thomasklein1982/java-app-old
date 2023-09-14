import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";

export function InterfaceTypeList(node,source,scope){
  node=node.firstChild;
  console.log("interface type list", node);
  if(node.name==="TypeName"){
    let index=0;
    let typeNames={};
    while(node.name==="TypeParameter"){
      let tp=TypeParameter(node,source,scope);
      tp.genericIndex=index;
      if(typeParameterNames[tp.name]===undefined){
        typeParameterNames[tp.name]=tp;
        typeParameters.push(tp);
      }else{
        throw source.createError("Doppelter Typ-Parameter '"+tp.name+"'.",node);
      }
      node=node.nextSibling;
      if(!node) break;
      if(node.name===","){
        node=node.nextSibling;
      }
      index++;
    }
    
  }
  return {
    
  };
}