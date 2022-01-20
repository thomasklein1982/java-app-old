import { PrimitiveType } from "./PrimitiveType";
import {Clazz} from "./Clazz";
import { Java } from "../language/java";

export class Type{
  constructor(baseType,dimension){
    if(baseType && !dimension && baseType.dim){
      dimension=baseType.dim;
      baseType=baseType.type;
    }
    this.baseType=baseType;
    this.dimension=dimension;
  }
  toString(){
    let t=this.baseType? this.baseType.name:"Unbekannter Datentyp";
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
      basetype=null;
    }
    return new Type(basetype,dimension);
  }
  isNumeric(){
    if(this.dimension>0) return false;
    return this.baseType.isNumeric===true;
  }
  isString(){
    if(this.dimension>0) return false;
    return this.baseType===Java.datatypes.String;
  }
  isNumericOrString(){
    return this.isNumeric() || this.isString();
  }
  isSubtypeOf(type){
    if(!type){
      return this.dimension===0;
    }
    if(type instanceof PrimitiveType || type instanceof Clazz){
      type={
        baseType: type,
        dimension: 0
      };
    }
    if("baseType" in type){
      if(type.dimension===this.dimension){
        if(!type.baseType){
          return true;
        }
        return this.baseType.isSubtypeOf(type.baseType);
      }else{
        return false;
      }
    }
    
  }
}