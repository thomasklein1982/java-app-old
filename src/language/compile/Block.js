import { Scope } from "../../classes/Scope";
import { Source } from "../../classes/Source";
import { CompileFunctions } from "../CompileFunctions";

/**
 * 
 * @param {*} node 
 * @param {Source} source 
 * @param {Scope} scope 
 * @returns 
 */
export function Block(node,source,scope){
  let code="";
  let errors=[];
  node=node.firstChild;
  if(node.type.isError || node.name!=='{'){
    errors.push(source.createError("'{' erwartet.",node));
    return {
      code,errors
    }
  }
  let open=true;
  while(node.nextSibling){
    node=node.nextSibling;
    if(node.name==='}'){
      open=false;
    }else{
      try{
        let f=CompileFunctions.get(node,source);
        code+="\n"+f(node,source,scope);
      }catch(e){
        errors.push(e);
      }
    }
  }
  if(open){
    errors.push(source.createError("'}' erwartet.",node));
  }
  return {
    code,errors
  }
}