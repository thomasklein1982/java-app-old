import { Java } from "../language/java";
import { Type } from "./Type";


export class PrimitiveType{
  constructor(name,supertype,initialValue,info){
    this.name=name;
    this.supertype=supertype;
    this.initialValue=initialValue;
    this.info=info;
    this.isNumeric=(typeof initialValue)==="number";
  }
  toString(){
    return this.name;
  }
  isSubtypeOf(type){
    if(!type) return true;
    if(type instanceof Type){
      if(this===Java.datatypes.nullType && !type.isPrimitive()) return true;
      if(type.dimension===0){
        type=type.baseType;
      }else{
        return false;
      }
    }
    if(type instanceof PrimitiveType){
      if(this===Java.datatypes.nullType) return false;
      if(this.name===type.name){
        return true;
      }
      return (this.supertype && this.supertype.isSubtypeOf(type));
    }
    if(this===Java.datatypes.nullType) return true;
    return false;
  }
}