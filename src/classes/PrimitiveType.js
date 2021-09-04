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
}