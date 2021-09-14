export class PrimitiveType{
  constructor(name,supertype,initialValue,info){
    this.name=name;
    this.supertype=supertype;
    this.initialValue=initialValue;
    this.info=info;
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
      if(this===type){
        return true;
      }
      return (this.supertype && this.supertype.isSubtypeOf(type));
    }
    return false;
  }
}