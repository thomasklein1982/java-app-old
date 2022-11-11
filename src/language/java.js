import {PrimitiveType} from "../classes/PrimitiveType";
import { Clazz } from "../classes/Clazz";
import { defineApp } from "./datatypes/App.js";
import { defineGenericClazz } from "./datatypes/GenericClazz";
import { appjsdata } from "../functions/snippets";
import { defineString } from "./datatypes/string";
import { defineUIClazzes } from "./datatypes/UI";
import { defineMath } from "./datatypes/Math";
import {defineDatabaseClazzes} from "./datatypes/Database";
import {definePattern} from "./datatypes/pattern";
import { defineMatcher } from "./datatypes/matcher";
import { defineFile } from "./datatypes/file";
import { defineStorage } from "./datatypes/storage";


let nullType=new PrimitiveType("null", null, null, "null ist das nicht vorhandene Objekt.");
let boolean=new PrimitiveType("boolean",null,false,"Ein 'boolean' (dt: 'Wahrheitswert') kann nur true oder false sein.",true);
let double=new PrimitiveType("double",null,0.0,"Ein 'double' ist eine Kommazahl.");
let int=new PrimitiveType("int",double,0,"Ein 'Integer' ist eine ganze Zahl.");
let char=new PrimitiveType("char",int,32,"Ein 'Character' (dt: 'Zeichen') ist ein einzelnes Zeichen (z. B. Buchstabe, Ziffer, Leerzeichen usw.).");
let Object=new Clazz("Object");
Object.cannotBeInstantiated=true;
const String=new Clazz("String");
String.cannotBeInstantiated=true;
let Math=new Clazz("Math");
Math.cannotBeInstantiated=true;
let Gamepad=new Clazz("Gamepad");
Gamepad.cannotBeInstantiated=true;
// let UI=new Clazz("UI");
// UI.cannotBeInstantiated=true;
let Path=new Clazz("Path");
Path.cannotBeInstantiated=true;
let Mouse=new Clazz("Mouse");
Mouse.cannotBeInstantiated=true;
let Console=new Clazz("Console");
Console.cannotBeInstantiated=true;
let World=new Clazz("World");
World.cannotBeInstantiated=true;
let Time=new Clazz("Time");
Time.cannotBeInstantiated=true;
let JComponent=new Clazz("JComponent");
JComponent.cannotBeInstantiated=true;
let JButton=new Clazz("JButton");
let JImage=new Clazz("JImage");
let JTextField=new Clazz("JTextField");
let JLabel=new Clazz("JLabel");
let JTextArea=new Clazz("JTextArea");
let JCheckBox=new Clazz("JCheckBox");
let JComboBox=new Clazz("JCombobox");
let JPanel=new Clazz("JPanel");
let DataTable=new Clazz("DataTable");
let App=new Clazz("App");
App.cannotBeInstantiated=true;
let Database=new Clazz("Database");
let Record=new Clazz("Record");
Record.cannotBeInstantiated=true;

let Pattern=new Clazz("Pattern");
Pattern.cannotBeInstantiated=true;
let Matcher=new Clazz("Matcher");
Matcher.cannotBeInstantiated=true;

let File=new Clazz("File");
File.cannotBeInstantiated=true;
let Storage=new Clazz("Storage");
Storage.cannotBeInstantiated=true;

let datatypes={
  nullType,boolean, double, int, char, Object, String,Math, App, Gamepad, Time, Console, World, Path, Mouse, JComponent,JButton, JPanel, JLabel, JTextArea, JTextField,JComboBox, JCheckBox, JImage, DataTable, Database, Record, Pattern, Matcher, File, Storage
};

let clazzes={
  nullType,Object, String, Math,App, Gamepad, Time, Console, World, Path, Mouse, JComponent,JButton, JPanel, JLabel, JTextArea, JTextField,JComboBox, JCheckBox, JImage,DataTable, Database, Record, Pattern, Matcher, File, Storage
}

export const Java={
  datatypes,
  clazzes
};


defineString(String,Java);
defineMath(Math,Java);
defineGenericClazz(Gamepad,appjsdata.objects.gamepad,Java);
defineGenericClazz(Console,appjsdata.objects.console,Java);
defineGenericClazz(Path,appjsdata.objects.path,Java);
defineGenericClazz(World,appjsdata.objects.world,Java);
defineGenericClazz(Time,appjsdata.objects.time,Java);
defineGenericClazz(Mouse,appjsdata.objects.mouse,Java);
defineGenericClazz(Storage,appjsdata.objects.storage,Java);
defineStorage(Storage);
defineApp(App,Java);
defineUIClazzes(Java);
defineDatabaseClazzes(Java);
definePattern(Pattern,Java);
defineMatcher(Matcher,Java);
defineFile(File);