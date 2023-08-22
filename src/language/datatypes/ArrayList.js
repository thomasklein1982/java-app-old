import { createMethod } from "../helper/createMethod";
import { createAttribute } from "../helper/createAttribute";
import { createConstructor } from "../helper/createConstructor";
import { Clazz } from "../../classes/Clazz";
import { Type } from "../../classes/Type";

export function defineArrayList(clazz){
  clazz.name="ArrayList";
  let T=new Clazz("T");
  T.cannotBeInstantiated=true;
  T.isGeneric=true;
  T.genericIndex=0;
  clazz.typeParameters=[T];
  createConstructor ({
    args: [
      {name: "initialCapacity", type: "int", optional: true}
    ]
  },clazz);
  let typeT=new Type(T,0);
  createMethod({
    name: "add",
    info: "",
    args: [{name: "element", type: typeT, info: ""},{name: "index", type: "int", info: "", optional: true}],
    reverseArgsOrder: true,
    returnType: 'boolean'
  },clazz,false,false);
  createMethod({
    name: "remove",
    info: "",
    args: [{name: "index", type: "int", info: ""}],
    returnType: 'boolean'
  },clazz,false,false);
  createMethod({
    name: "clear",
    info: "",
    args: [],
  },clazz,false,false);
  createMethod({
    name: "addAll",
    info: "",
    args: [{name: "collection", type: clazz, info: ""}, {name: "index", type: "int", info: "",optional: true}],
    reverseArgsOrder: true,
    returnType: 'boolean'
  },clazz,false,false);
  createMethod({
    name: "get",
    info: "",
    args: [{name: "index", type: "int", info: ""}],
    returnType: typeT
  },clazz,false,false);
}
