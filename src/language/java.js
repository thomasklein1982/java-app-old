import { defineObject } from "./datatypes/object.js";
import { defineString } from "./datatypes/string.js";
import { definePrintStream } from "./datatypes/printStream.js";
import { defineSystem } from "./datatypes/system.js";
import {PrimitiveType} from "../classes/PrimitiveType";
import { Clazz } from "../classes/Clazz";
import { defineApp } from "./datatypes/App.js";

let boolean=new PrimitiveType("boolean",null,false,"Ein 'boolean' (dt: 'Wahrheitswert') kann nur true oder false sein.",true);
let double=new PrimitiveType("double",null,0.0,"Ein 'double' ist eine Kommazahl.");
let int=new PrimitiveType("int",double,0,"Ein 'Integer' ist eine ganze Zahl.");
let char=new PrimitiveType("char",int,32,"Ein 'Character' (dt: 'Zeichen') ist ein einzelnes Zeichen (z. B. Buchstabe, Ziffer, Leerzeichen usw.).");
let Object=new Clazz("Object");
let String=new Clazz("String");
let App=new Clazz("App");


//let Record=new Clazz("Record");
//let Matrix=new Clazz("Matrix");
//let Sound=new Clazz("Sound");
//let Image=new Clazz("Image");
//let System=new Clazz("System");
//let PrintStream=new Clazz("PrintStream");
/*typ für int-literale:*/
let rawint=new PrimitiveType("rawint");


let datatypes={
  boolean, double, int, char, Object, String, rawint, App
};

let clazzes={
  Object, String, App
}

export const Java={
  datatypes,
  clazzes
};

defineApp(App,Java);