import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";

export function ReturnStatement(node,source,scope){
  node=node.firstChild;
  if(node.name!=="return"){

  }
  let code="return ";
  node=node.nextSibling;
  let returnType=scope.method.type;
  if(node && !node.type.isError && node.name!==";"){
    if(returnType){
      let v=CompileFunctions.get(node,source)(node,source,scope);
      returnType.autoCastValue(v);
      if(!v.type.isSubtypeOf(returnType)){
        throw source.createError("Diese Methode muss ein "+returnType.toString()+" zurückliefern, dies ist aber ein "+v.type.toString()+".",node);
      }
      code+="await "+v.code;
    }else{
      throw source.createError("Eine void-Methode kann keinen Wert zurückgeben.",node);
    }
  }else{
    if(returnType){
      throw source.createError("Diese Methode muss ein "+returnType.toString()+" zurückliefern.",node);
    }
  }
  if(!node || node.nextSibling.type.isError || node.nextSibling.name!==";"){
    throw (source.createError("';' erwartet.",node.nextSibling));
  }
  return {
    code: code,
    type: null
  };
}