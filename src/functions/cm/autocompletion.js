import  * as autocomplete  from "@codemirror/autocomplete";
import {CompletionContext} from "@codemirror/autocomplete";
import {Type} from "../../classes/Type";
import {createParamsString,snippets} from '../snippets'
import {Java} from '../../language/java';
import {getClazzFromState} from './getClazzFromState';

const completePropertyAfter = ["PropertyName", ".", "?."]
const dontCompleteIn = ["TemplateString", "LineComment", "BlockComment",
                        "VariableDefinition", "PropertyDefinition"]

function getRealNodeBefore(node,pos){
  if(node && node.firstChild && !node.firstChild.type.isError && node.firstChild.to<pos){
    let n=node.firstChild;
    while(n && n.nextSibling && !n.nextSibling.type.isError && n.nextSibling.to<pos){
      n=n.nextSibling;
    }
    return getRealNodeBefore(n,pos);
  }else{
    return node;
  }
}

export function createAutocompletion(){
  return (context)=>{
    let pos=context.pos;
    let lastTypedCharacter=context.state.doc.sliceString(context.pos-1,context.pos);
    if(["{","}",",",";","[","]","(",")"].indexOf(lastTypedCharacter)>=0) return;
    let nodeBefore = context.state.tree.resolveInner(pos, -1);
    nodeBefore=getRealNodeBefore(nodeBefore,pos);
    if(!nodeBefore) return;
    if(dontCompleteIn.includes(nodeBefore.name)) {
      console.log("dont autocomplete",nodeBefore.name);
      return;
    }
    if(nodeBefore.name===";"){
      return;
    }
    //innerhalb einer Methode?
    let method=null;
    let clazz=getClazzFromState(context.state);
    if(!clazz) return;
    let n=nodeBefore.parent.parent;
    if(n.type.name==="FormalParameters") return;
    while(n){
      if(n.type.name==="MethodDeclaration"||n.type.name==="ConstructorDeclaration"){
        if(n.name==="ConstructorDeclaration"){
          method=clazz.constructor;
        }else{
          n=n.firstChild;
          while(n && n.name!=="Definition"){
            n=n.nextSibling;
          }
          if(n){
            let mname=context.state.doc.sliceString(n.from,n.to);
            method=clazz.methods[mname];
          }
        }
        break;
      }
      n=n.parent;
    }
    
    if(nodeBefore.name==="}"){
      if(nodeBefore.parent.name==="Block"){
        let n=nodeBefore.parent.parent;
        if(n.name==="ConstructorDeclaration" || n.name==="MethodDeclaration" || n.name==="FieldDeclaration"){
          method=null;
        }
      }
    }
    let from;
    if(!method){
      if(clazz.hasStaticMainMethod()){
        console.log(nodeBefore.name);
        //if(nodeBefore.name==="{") return;
        from=nodeBefore.from;
        // if(nodeBefore.name==="void"){
        //   from=nodeBefore.from;
        // }else{
        //   from=pos;
        // }
        return {
          from,
          options: snippets.eventListeners,
          span: /^[\w$]*$/
        }
      }else{
        if(nodeBefore.name==="void"){
          from=nodeBefore.from;
        }else{
          from=pos;
        }
        let options=[
          autocomplete.snippetCompletion("public static void main(String[] args){\n\tnew "+clazz.name+"();\n}", {
            label: "main",
            info: "Statische main-Methode.",
            type: "function"
          })
        ];
        return {
          from,
          options: options,
          span: /^[\w$]*$/
        }
      }
      return;
    }
    let annotation;
    if(nodeBefore.name==="Identifier" && nodeBefore.prevSibling){
      context.pos=nodeBefore.from;
      nodeBefore=nodeBefore.prevSibling;
    }
    if(nodeBefore.name==="new"){
      if(context.pos===nodeBefore.to){
        return;
      }
      from=context.pos;
      let options=[];
      let clazzes=app.$refs.editor.project.clazzes;
      for(let i=0;i<clazzes.length;i++){
        let c=clazzes[i];
        let m=c.constructor;
        options.push(autocomplete.snippetCompletion(c.name+createParamsString(m,true),{
          label: c.name+"(...)",
          type: "function",
          info: c.comment
        }));
      }
      for(let name in Java.clazzes){
        let c=Java.clazzes[name];
        if(c.cannotBeInstantiated || c.name==="null") continue;
        let m=c.constructor;
        options.push(autocomplete.snippetCompletion(name+createParamsString(m,true),{
          label: name+"(...)",
          type: "function",
          info: c.comment
        }));
      }
      return {
        from,
        options,
        span: /^[\w$]*$/
      }
    }else if(nodeBefore.name==="AssignOp"||nodeBefore.name==="Block"||nodeBefore.name==="["||nodeBefore.name==="("||nodeBefore.name==="{"){
      from=context.pos;
      annotation={type: new Type(clazz,0), isStatic: method.isStatic(), topLevel: true};
    }else{
      from=nodeBefore.from;
      if((nodeBefore.name==="Identifier" || nodeBefore.name==="TypeName") && nodeBefore.prevSibling && nodeBefore.prevSibling.name==="."){
        /**zuruecklesen bis zu moeglichem Punkt */
        nodeBefore=nodeBefore.prevSibling;
        from--;
      }
      if(nodeBefore.name==="."){
        from++;
        annotation=method.typeAnnotations[nodeBefore.to-1];
      }else{
        if(nodeBefore.prevSibling && nodeBefore.prevSibling.name!=="(" && !nodeBefore.prevSibling.name.endsWith("Op")){
          nodeBefore=nodeBefore.prevSibling;
          if(nodeBefore && nodeBefore.name==="."){
            nodeBefore=nodeBefore.prevSibling;
          }
          annotation=method.typeAnnotations[nodeBefore.to];
        }else{
          let scope=method.getScopeAtPosition(from);
          annotation={type: new Type(clazz,0), isStatic: method.isStatic(), topLevel: true, scope: scope};
        }
      }
      
    }
    if(annotation){
      return completeProperties(from,annotation.type,annotation.isStatic,annotation.topLevel, method, annotation.scope);
    }
    return null
  };
}

function completeProperties(from, type, isStatic, includeClasses, method, scope) {
  let options = [];
  if(type.dimension>0){
    options.push({
      label: "length",
      type: "variable",
      info: "Die Länge des Arrays."
    });
  }else{
    if(scope){
      let locals=scope.getLocalVariables();
      for(let vname in locals){
        options.push({
          label: vname,
          type: "variable",
          info: "Eine lokale Variable des Typs "+locals[vname].type.toString()
        });
      }
    }
    let clazz=type.baseType;
    while(clazz){
      let attributeNames=clazz.getAllAttributeNames();
      for (let name in attributeNames) {
        let a=clazz.getAttribute(name,isStatic);
        if(a.isStatic()===isStatic){
          options.push({
            label: name,
            type: "variable",
            info: a.comment
          });
        }
      }
      clazz=clazz.superClazz;
    }
    clazz=type.baseType;
    while(clazz){
      for (let name in clazz.methods) {
        let m=clazz.methods[name];
        if(m.isStatic()===isStatic){
          options.push(autocomplete.snippetCompletion(name+createParamsString(m,true),{
            label: name+"(...)",
            type: "function",
            info: m.comment
          }));
        }
      }
      clazz=clazz.superClazz;
    }
    if(includeClasses){
      if(method){
        for(let i=0;i<snippets.inMethod.length;i++){
          options.push(snippets.inMethod[i]);
        }
      }
      for(let name in Java.clazzes){
        let c=Java.clazzes[name];
        options.push({
          label: name,
          type: "class",
          info: c.comment
        });
      }
    }
    
  }
  return {
    from,
    options,
    span: /^[\w]*$/
  }
}