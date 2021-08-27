import { defineObject } from "./datatypes/object.js";
import { defineString } from "./datatypes/string.js";
import {BaseType} from "../classes/BaseType";

let boolean=new BaseType("boolean",null,false,"Ein 'boolean' (dt: 'Wahrheitswert') kann nur true oder false sein.",true);
let double=new BaseType("double",null,0.0,"Ein 'double' ist eine Kommazahl.",true);
let int=new BaseType("int",double,0,"Ein 'Integer' ist eine ganze Zahl.",true);
let char=new BaseType("char",int,32,"Ein 'Character' (dt: 'Zeichen') ist ein einzelnes Zeichen (z. B. Buchstabe, Ziffer, Leerzichen usw.).",true);
let object=new BaseType("Object",null,null,"'Object' ist die grundlegende Klasse in Java: Jede andere Klasse ist eine Unterklasse von 'Object'.");
let string=new BaseType("String",object,null);
let Record=new BaseType("Record",object,null);
let Matrix=new BaseType("Matrix",object,null);
let Sound=new BaseType("Sound",object,null);
let Image=new BaseType("Image",object,null);
/*typ für int-literale:*/
let rawint=new BaseType("rawint",undefined,true);

defineObject(object,string,boolean);
defineString(string,char);

export const Java={
  datatypes: {
    boolean, double, int, char, Object: object, String: string, Record, Matrix, Sound, Image, rawint
  }
};