import { Method } from "../../classes/Method";
import { Modifiers } from "../../classes/Modifiers";
import { Parameter, ParameterList } from "../../classes/Parameters";
import { Type } from "../../classes/Type";

export function createMethod(data,clazz,isStatic,isConstructor,Java){
  let m=new Method(clazz,isConstructor);
  m.name=data.name;
  if(m.name==="getValue"){
    window.dString=Java.datatypes.String;
  }
  if(isConstructor){
    clazz.constructor=m;
  }else{
    clazz.methods[m.name]=m;
  }
  m.comment=data.info;
  m.params=new ParameterList(m);
  if(data.args){
    for(let j=0;j<data.args.length;j++){
      let a=data.args[j];
      let p=new Parameter(m.params);
      if(a.type.baseType){
        p.type=new Type(Java.datatypes[a.type.baseType],a.type.dim);
      }else{
        p.type=new Type(Java.datatypes[a.type],0);
      }
      p.name=a.name;
      m.params.parameters.push(p);
    }
  }
  if(data.jsName){
    m.jsName=data.jsName;
  }
  if(data.returnType){
    let baseType=data.returnType;
    if(baseType.baseType){
      baseType=baseType.baseType;
    }
    baseType=Java.datatypes[baseType];
    if(data.returnType.dimension>0){
      m.type=new Type(baseType,data.returnType.dimension);
    }else{
      m.type=new Type(baseType,0);
    }
  }else{
    m.type=null;
  }
  m.modifiers=new Modifiers();
  m.modifiers.visibility='public';
  if(isStatic){
    m.modifiers.isStatic=true;
  }else{
    m.modifiers.isStatic=false;
  }
  return m;
}