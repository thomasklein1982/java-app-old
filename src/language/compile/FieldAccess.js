import { CompileFunctions } from "../CompileFunctions";
import { Identifier } from "./Identifier";

export function FieldAccess(node,source,scope,errors){
  console.log(node);
  node=node.firstChild;
  let context;
  while(node){
    if(node.name==="Identifier"){
      let obj=Identifier(node,source,scope,errors);
      
    }
    node=node.nextSibling;
  }
  return {

  };
}