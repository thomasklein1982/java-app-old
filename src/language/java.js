import {PrimitiveType} from "../classes/PrimitiveType";
import { Clazz } from "../classes/Clazz";
import { defineApp } from "./datatypes/App.js";
import { defineGenericClazz } from "./datatypes/GenericClazz";
import { appjsdata } from "../functions/snippets";

let boolean=new PrimitiveType("boolean",null,false,"Ein 'boolean' (dt: 'Wahrheitswert') kann nur true oder false sein.",true);
let double=new PrimitiveType("double",null,0.0,"Ein 'double' ist eine Kommazahl.");
let int=new PrimitiveType("int",double,0,"Ein 'Integer' ist eine ganze Zahl.");
let char=new PrimitiveType("char",int,32,"Ein 'Character' (dt: 'Zeichen') ist ein einzelnes Zeichen (z. B. Buchstabe, Ziffer, Leerzeichen usw.).");
let Object=new Clazz("Object");
let String=new Clazz("String");
let Gamepad=new Clazz("Gamepad");
let UI=new Clazz("UI");
let Path=new Clazz("Path");
let Mouse=new Clazz("Mouse");
let Console=new Clazz("Console");
let JButton=new Clazz("JButton");
let JTextField=new Clazz("JTextField");
let JLabel=new Clazz("JLabel");
let JTextArea=new Clazz("JTextArea");
let JCombobox=new Clazz("JCombobox");
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
  boolean, double, int, char, Object, String, rawint, App, Gamepad, UI, Mouse, Console, JButton, JLabel, JTextArea, JTextField, JCombobox, Path
};

let clazzes={
  Object, String, App, Gamepad
}

export const Java={
  datatypes,
  clazzes
};


defineGenericClazz(Gamepad,appjsdata.objects.gamepad,Java);
defineApp(App,Java);

console.log(Gamepad);
console.log(App);