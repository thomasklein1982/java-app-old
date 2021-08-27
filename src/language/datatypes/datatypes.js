import { Datatype } from "../../classes/BaseType.js";

let boolean=new Datatype("boolean",null,false,"Ein 'boolean' (dt: 'Wahrheitswert') kann nur true oder false sein.",true);
let double=new Datatype("double",null,0.0,"Ein 'double' ist eine Kommazahl.",true);
let int=new Datatype("int",double,0,"Ein 'Integer' ist eine ganze Zahl.",true);
let char=new Datatype("char",int,32,"Ein 'Character' (dt: 'Zeichen') ist ein einzelnes Zeichen (z. B. Buchstabe, Ziffer, Leerzichen usw.).",true);
let object=new Datatype("Object",null,null,"'Object' ist die grundlegende Klasse in Java: Jede andere Klasse ist eine Unterklasse von 'Object'.");
let string=new Datatype("String",object,null);
let record=new Datatype("Record",object,null);
let matrix=new Datatype("Matrix",object,null);
let sound=new Datatype("Sound",object,null);
let image=new Datatype("Image",object,null);
/*typ für int-literale:*/
let rawint=new Datatype("rawint",undefined,true);

export {
  boolean,double,int,char,object,string,record,matrix,sound,image,rawint
};

