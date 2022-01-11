import { Attribute } from "../../classes/Attribute";
import { Modifiers } from "../../classes/Modifiers";

export function createAttribute(data,clazz,isStatic,Java){
  let a=new Attribute(clazz);
  a.name=data.name;
  clazz.attributes[a.name]=a;
  a.comment=data.info;
  console.log("attribute",data);
  a.type=Java.datatypes[data.type];
  a.modifiers=new Modifiers();
  a.modifiers.visibility='public';
  a.modifiers.isStatic=isStatic===true;
}