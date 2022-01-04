import { CompileFunctions } from "../CompileFunctions";

export function VariableDeclarator(node,source,scope){
  let code;
  let type=null;
  node=node.firstChild;
  let name=source.getText(node);
  if(node.nextSibling){
    node=node.nextSibling;
    if(node.name!=="AssignOp"){
      throw source.createError("'=' erwartet.",node);
    }
    node=node.nextSibling;
    let val=CompileFunctions.get(node,source)(node,source,scope);
    if(!val.type){
      throw source.createError("Es existiert kein Wert, der zugewiesen werden könnte (ich verstehe es selbst nicht ganz...).",node);
    }
    code=name+"="+val.code;
    type=val.type;
  }else{
    code=name;
  }
  return {
    code,
    name,
    type
  }
}