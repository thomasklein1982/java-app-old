import { PrimitiveType } from "./PrimitiveType";
import {Clazz} from "./Clazz";
import { Java } from "../language/java";

export class Type{
  constructor(baseType,dimension){
    if(baseType && baseType.type){
      if(baseType.dim){
        dimension=baseType.dim;
      }
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
    //console.log(this.baseType.name,this.baseType===Java.datatypes.String,this.baseType===window.dString,window.dString===Java.datatypes.String,Java.datatypes.String===Java.clazzes.String);
    return this.baseType===Java.datatypes.String;
  }
  isInt(){
    if(this.dimension>0) return false;
    return this.baseType===Java.datatypes.int;
  }
  isDouble(){
    if(this.dimension>0) return false;
    return this.baseType===Java.datatypes.double;
  }
  isBoolean(){
    if(this.dimension>0) return false;
    return this.baseType===Java.datatypes.boolean;
  }
  isPrimitive(){
    return this.dimension===0 && (this.baseType instanceof PrimitiveType);
  }
  autoCastValue(value){
    if(!value.type) return false;
    value.code="$u("+value.code+")";
    let castFromStringToPrimitive=false;
    if(value.type.isString() && this.isPrimitive()){
      castFromStringToPrimitive=true;
      value.type=this;
    }
    if(this.isInt() && value.type.isDouble()){
      value.type=this;
      value.code="$i("+value.code+")";
    }else if(value.type.isInt()){
      value.code="$i("+value.code+")";
    }
    if(castFromStringToPrimitive){
      if(this.isNumeric()){
        value.code="$v("+value.code+")";
      }else if(this.isBoolean()){
        value.code="("+value.code+"==='true')";
      }
      return true;
    }else if(this.isString()){
      value.type=this;
      value.code="("+value.code+"+'')";
      return true;
    }
    return false;
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