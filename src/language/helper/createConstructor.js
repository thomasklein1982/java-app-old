import { Method } from "../../classes/Method";
import { Modifiers } from "../../classes/Modifiers";
import { Parameter, ParameterList } from "../../classes/Parameters";
import { Type } from "../../classes/Type";
import { createMethod } from "./createMethod";

export function createConstructor(data,clazz,Java){
  let m=createMethod(data,clazz,false,true,Java);
  return m;
}