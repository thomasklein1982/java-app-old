import { Method } from "../../classes/Method";
import { Modifiers } from "../../classes/Modifiers";
import { Parameter, ParameterList } from "../../classes/Parameters";

export function createMethod(data,clazz,isStatic,Java){
  let m=new Method(clazz);
  m.name=data.name;
  clazz.methods[m.name]=m;
  m.comment=data.info;
  m.params=new ParameterList(m);
  if(data.args){
    for(let j=0;j<data.args.length;j++){
      let a=data.args[j];
      let p=new Parameter(m.params);
      if(a.type.baseType){
        p.type={
          baseType: Java.datatypes[a.type.baseType],
          dim: a.type.dim
        };
      }else{
        p.type=Java.datatypes[a.type];
      }
      p.name=a.name;
      m.params.parameters.push(p);
    }
  }
  if(m.returnType){
    m.type=Java.datatypes[m.returnType];
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
}