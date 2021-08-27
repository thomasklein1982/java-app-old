import { CompileFunctions } from "../language/CompileFunctions";
import { Value } from "./Value";


export class Statement{
  constructor(block){
    this.block=block;
  }

  compile(node,source,scope,errors){
    let f=CompileFunctions.get(node,source,errors);
    return f(node,source,scope,errors);
  }
}