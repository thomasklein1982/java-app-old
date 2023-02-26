import { Error } from "../../classes/Error";
import { Scope } from "../../classes/Scope";
import { Source } from "../../classes/Source";
import { ArgumentList } from "./ArgumentList";
import { FieldAccess } from "./FieldAccess";
import { Identifier } from "./Identifier";
import { Clazz } from "../../classes/Clazz";
import { Java } from "../java";
import { Type } from "../../classes/Type";
import { ArrayAccess } from "./ArrayAccess";
import { CompileFunctions } from "../CompileFunctions";
/**
 * 
 * @param {*} node 
 * @param {Source} source 
 * @param {Scope} scope 
 */
export function MethodInvocation(node,source,scope){
  node=node.firstChild;
  
  let mn,al,methods;
  let code="";
  let owner={
    clazz: null,
    static: false
  };
  if(node.name==="MethodName" && node.nextSibling.type.isError){
    /**seltsamerweise scheinen manchmal auch identifier hier zu landen?!? (UIClazz) */
    let code=Identifier(node,source,scope);
    console.log(code);
    return code;
  }
  if(node.name==="MethodName"||node.name==="this"){
    owner.clazz=scope.method.clazz;
    code+="this";
    if(node.name==="this"){
      node=node.nextSibling.nextSibling;
    }
  }else{
    if(node.name==="Identifier"){
      let id=Identifier(node,source,scope);
      code+=id.code;
      if(id.object instanceof Clazz){
        owner={
          clazz: id.object,
          static: true
        };
      }else{
        owner={
          clazz: id.object.type.baseType,
          static: false
        };
      }
    }else{
      let f=CompileFunctions.get(node,source);
      let fa=f(node,source,scope);
      code+=fa.code;
      owner={
        clazz: fa.type.baseType,
        static: false
      };
    }
    node=node.nextSibling;
    if(node.name==="."){
    }else{
      throw (source.createError(null,node));
    }
    node=node.nextSibling;
  }
  if(node.name!=="MethodName"){
  }
  mn=source.getText(node);
  let method=scope.getMethod(mn,owner.static,owner.clazz);
  if(method.error){
    throw (source.createError(method.error,node));
  }
  if(method.isExtraFunction){
    
  }else{ 
    code+=".";
    if(method.jsName){
      code+=method.jsName;
    }else{
      code+=mn;
    }
  }
  node=node.nextSibling;
  
  if(node.name!=="ArgumentList"){
  }
  let updateLocalVariablesAfter=!method.isBuiltIn();
  al=ArgumentList(node,source,scope,method.params);
  if(al.updateLocalVariablesAfter){
    updateLocalVariablesAfter=true;
  }
  if(method.isExtraFunction){
    if(al.list.length===0){
      code=method.jsName+"("+code+")";
    }else{
      code=method.jsName+"("+code+","+al.code.substring(1);
    }
  }else{
    code+=al.code;
  }
  code="await "+code;
  if(method.type){
    let startLine=undefined;
    if(method.bodyNode){
      startLine=source.getLine(method.bodyNode.from).number;
      code="$m("+code+",\"Die Methode "+method.name+" muss einen Wert vom Typ "+method.type.toString()+" zurückgeben.\","+startLine+")";
    }
    scope.addTypeAnnotation(node,method.type,false);
  }
  return {
    method,arguments: al, code, type: method.type? method.type: null, updateLocalVariablesAfter
  }
}