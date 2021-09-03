import { BaseType } from "./BaseType";

export class Type{
  constructor(baseType,dimension){
    this.baseType=baseType;
    this.dimension=dimension;
  }
  toString(){
    let t=this.baseType.name;
    let d=this.dimension;
    while(d>0){
      t+="[]";
      d--;
    }
    return t;
  }
  static compile(node,source,project,errors){
    let name,dimension,isPrimitive;
    let startNode=node;
    if(node.name==="PrimitiveType"){
      name=source.getText(node);
      dimension=0;
      isPrimitive=true;
    }else if(node.name==="TypeName"){
      name=source.getText(node);
      dimension=0;
      isPrimitive=false;
    }else if(node.name==="ArrayType"){
      node=node.firstChild;
      if(node.name==="PrimitiveType"){
        isPrimitive=true;
        name=source.getText(node);
      }else{
        isPrimitive=false;
        name=source.getText(node);
      }
      node=node.nextSibling;
      var parent=node;
      /**jetzt Folge von [] */
      dimension=0;
      while(parent){
        node=parent.firstChild;
        if(node.name==="["){
          
        }else{
          errors.push(source.createError("'[' erwartet.",node));
          break;
        }
        node=node.nextSibling;
        if(node.name==="]"){
          
        }else{
          errors.push(source.createError("']' erwartet.",node));
          break;
        }
        parent=parent.nextSibling;
        dimension++;
      }
    }
    let basetype=project.getTypeByName(name);
    if(!basetype){
      errors.push(source.createError("Es gibt keinen Datentyp '"+name+"'.",startNode));
      basetype=new BaseType(name,null,null,"Unbekannter Datentyp",false);
    }
    return new Type(basetype,dimension);
  }
  isSubtypeOf(type){
    if(type===this){
      return true;
    }
    if(this.supertype){
      return this.supertype.isSubtypeOf(type);
    }
  }
}