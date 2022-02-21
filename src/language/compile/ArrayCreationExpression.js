import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { ArrayInitializer } from "./ArrayInitializer";
import { Dimension } from "./Dimension";
import { TypeName } from "./TypeName";

export function ArrayCreationExpression(node,source,scope,errors){
  node=node.firstChild;
  let code;
  if(node.name!=="new"){

  }
  code="new $App.Array(";
  node=node.nextSibling;
  if(node.name!=="TypeName"){

  }
  let type=TypeName(node,source,scope);
  code+=JSON.stringify(type.code)+",";
  node=node.nextSibling;
  let dimensions=[];
  let specified=null;
  while(node && node.name==="Dimension"){
    let dim=Dimension(node,source,scope);
    if(specified===null){
      specified=dim.specified;
    }
    if(!dim.specified && specified){
      throw source.createError("int erwartet",node);
    }
    dimensions.push(dim.code);
    node=node.nextSibling;
  }
  if(specified){
    code+="["+dimensions.join(",")+"]";
  }else{
    code+=dimensions.length;
  }
  let arraytype=new Type(type.type.baseType,dimensions.length);
  if(node && node.name==="ArrayInitializer"){
    let ai=ArrayInitializer(node,source,scope,arraytype);
    code+=","+ai.code;
  }
  code+=")";
  return {
    code,
    type: arraytype
  }
}