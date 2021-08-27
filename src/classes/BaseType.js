export class BaseType{
  constructor(name,supertype,initialValue,info,isPrimitive){
    this.name=name;
    this.supertype=supertype;
    this.initialValue=initialValue;
    this.isPrimitive=isPrimitive===true;
    this.info=info;
  }
  toString(){
    return this.name;
  }
  defineMembers(members){
    if(members.a){
      this.attributes=members.a;
      for(var i in this.attributes){
        this.attributes[i].name=i;
      }
    }
    if(members.c){
      this.constructors=members.c;
    }
    if(members.m){
      this.methods=members.m;
    }
  }
}