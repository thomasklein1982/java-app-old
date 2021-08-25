import { Error } from "./Error";

export class Source{
  constructor(src,state){
    this.src=src;
    this.state=state;
  }
  createError(message,node){
    return new Error(message,node,this);
  }
  getText(node){
    return this.src.substring(node.from,node.to);
  }
}