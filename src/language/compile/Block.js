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
  let errors=scope.method.clazz.errors;
  node=node.firstChild;
  if(node.type.isError || node.name!=='{'){
    errors.push(source.createError("'{' erwartet.",node));
    return {
      code,errors
    }
  }
  scope.pushLayer();
  let open=true;
  while(node.nextSibling){
    node=node.nextSibling;
    if(node.name==='}'){
      open=false;
    }else{
      try{
        let f=CompileFunctions.get(node,source);
        let res=f(node,source,scope);
        let line=source.state.doc.lineAt(node.from).number;
        code+="\nawait $App.debug.line("+line+","+JSON.stringify(scope.method.clazz.name)+");"+res.code;
      }catch(e){
        errors.push(e);
      }
    }
  }
  if(open){
    errors.push(source.createError("'}' erwartet.",node));
  }
  scope.popLayer();
  return {
    code
  }
}