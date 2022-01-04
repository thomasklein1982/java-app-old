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
      if(type.dimension===0){
        type=type.baseType;
      }else{
        return false;
      }
    }
    if(type instanceof PrimitiveType){
      if(this.name===type.name){
        return true;
      }
      return (this.supertype && this.supertype.isSubtypeOf(type));
    }
    return false;
  }
}