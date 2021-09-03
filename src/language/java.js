import { defineObject } from "./datatypes/object.js";
import { defineString } from "./datatypes/string.js";
import { definePrintStream } from "./datatypes/printStream.js";
import { defineSystem } from "./datatypes/system.js";
import {BaseType} from "../classes/BaseType";

let boolean=new BaseType("boolean",null,false,"Ein 'boolean' (dt: 'Wahrheitswert') kann nur true oder false sein.",true);
let double=new BaseType("double",null,0.0,"Ein 'double' ist eine Kommazahl.",true);
let int=new BaseType("int",double,0,"Ein 'Integer' ist eine ganze Zahl.",true);
let char=new BaseType("char",int,32,"Ein 'Character' (dt: 'Zeichen') ist ein einzelnes Zeichen (z. B. Buchstabe, Ziffer, Leerzichen usw.).",true);
let Object=new BaseType("Object",null,null,"'Object' ist die grundlegende Klasse in Java: Jede andere Klasse ist eine Unterklasse von 'Object'.");
let String=new BaseType("String",Object,null);
let Record=new BaseType("Record",Object,null);
let Matrix=new BaseType("Matrix",Object,null);
let Sound=new BaseType("Sound",Object,null);
let Image=new BaseType("Image",Object,null);
let System=new BaseType("System",Object,null);
let PrintStream=new BaseType("PrintStream",Object,null);
/*typ für int-literale:*/
let rawint=new BaseType("rawint",undefined,true);

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