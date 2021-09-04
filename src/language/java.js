import { defineObject } from "./datatypes/object.js";
import { defineString } from "./datatypes/string.js";
import { definePrintStream } from "./datatypes/printStream.js";
import { defineSystem } from "./datatypes/system.js";
import {PrimitiveType} from "../classes/PrimitiveType";

let boolean=new PrimitiveType("boolean",null,false,"Ein 'boolean' (dt: 'Wahrheitswert') kann nur true oder false sein.",true);
let double=new PrimitiveType("double",null,0.0,"Ein 'double' ist eine Kommazahl.");
let int=new PrimitiveType("int",double,0,"Ein 'Integer' ist eine ganze Zahl.");
let char=new PrimitiveType("char",int,32,"Ein 'Character' (dt: 'Zeichen') ist ein einzelnes Zeichen (z. B. Buchstabe, Ziffer, Leerzichen usw.).");
let Object=new Clazz("Object");
let String=new Clazz("String");
let Record=new Clazz("Record");
let Matrix=new Clazz("Matrix");
let Sound=new Clazz("Sound");
let Image=new Clazz("Image");
let System=new Clazz("System");
let PrintStream=new Clazz("PrintStream");
/*typ für int-literale:*/
let rawint=new PrimitiveType("rawint");

let datatypes={
  boolean, double, int, char, Object, String, Record, Matrix, Sound, Image, rawint, System, PrintStream
};

defineObject(datatypes);
defineString(datatypes);
definePrintStream(datatypes);
defineSystem(datatypes);

export const Java={
  datatypes
};