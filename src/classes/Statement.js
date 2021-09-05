import { CompileFunctions } from "../language/CompileFunctions";
import { Scope } from "./Scope";
import { Source } from "./Source";
import { Value } from "./Value";


export class Statement{
  constructor(block){
    this.block=block;
  }

  /**
   * 
   * @param {*} node 
   * @param {Source} source 
   * @param {Scope} scope 
   * @param {*} errors 
   */
  compile(node,source,scope,errors){
    let f=CompileFunctions.get(node,source,errors);
    let a=f(node,source,scope,errors);
    if(a && a.error){
      errors.push(source.createError(a.error,node));
    }
  }
}