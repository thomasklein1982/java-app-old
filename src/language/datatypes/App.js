import { Method } from "../../classes/Method";
import { Parameter, ParameterList } from "../../classes/Parameters";
import { appjsdata } from "../../functions/snippets"
import { Modifiers } from "../../classes/Modifiers";

export function defineApp(App,Java){
  let functions=appjsdata.functions;
  for(let i=0;i<functions.length;i++){
    let f=functions[i];
    let m=new Method(App);
    App.methods[f.name]=m;
    m.name=f.name;
    m.comment=f.info;
    m.params=new ParameterList(m);
    for(let j=0;j<f.args.length;j++){
      let a=f.args[j];
      let p=new Parameter(m.params);
      p.type=Java.datatypes[a.type];
      p.name=a.name;
      m.params.parameters.push(p);
    }
    if(f.returnType){
      m.type=Java.datatypes[f.returnType];
    }else{
      m.type=null;
    }
    m.modifiers=new Modifiers();
    m.modifiers.visibility='public';
    m.modifiers.isStatic=true;
  }

};