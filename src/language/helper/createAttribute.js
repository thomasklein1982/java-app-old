import { Attribute } from "../../classes/Attribute";
import { Modifiers } from "../../classes/Modifiers";
import { Type } from "../../classes/Type";

export function createAttribute(data,clazz,isStatic,Java){
  let a=new Attribute(clazz);
  a.name=data.name;
  clazz.attributes[a.name]=a;
  a.comment=data.info;
  let baseType=data.type;
  if(baseType.baseType){
    baseType=baseType.baseType;
  }
  baseType=Java.datatypes[baseType];
  if(data.type.dimension>0){
    a.type=new Type(baseType,data.type.dimension);
  }else{
    a.type=new Type(baseType,0);
  }
  a.modifiers=new Modifiers();
  a.modifiers.visibility='public';
  a.modifiers.isStatic=isStatic===true;
  return a;
}