import  * as autocomplete  from "@codemirror/autocomplete";
import {CompletionContext} from "@codemirror/autocomplete";
import {Type} from "../../classes/Type";
import {createParamsString,snippets} from '../snippets'
import {Java} from '../../language/java';
import {getClazzFromState} from './getClazzFromState';


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
    let nodeBefore = context.state.tree.resolveInner(pos, -1);
    nodeBefore=getRealNodeBefore(nodeBefore,pos);
    if(!nodeBefore) return;
    //innerhalb einer Methode?
    let method=null;
    let clazz=getClazzFromState(context.state);
    if(!clazz) return;
    let n=nodeBefore;
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
        if(nodeBefore.name==="TypeName"){
          from=nodeBefore.from;
        }else{
          from=pos;
        }
        return {
          from,
          options: snippets.eventListeners,
          span: /^[\w$]*$/
        }
      }
      return;
    }
    let annotation;

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
        if(c.cannotBeInstantiated) continue;
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
    }else if(nodeBefore.name==="Block"){
      from=context.pos;
      annotation={type: new Type(clazz,0), isStatic: method.isStatic(), topLevel: true};
    }else{
      from=nodeBefore.from;
      if(nodeBefore.name==="."){
        nodeBefore=nodeBefore.prevSibling;
        from++;
      }else{
        if(nodeBefore.prevSibling){
          nodeBefore=nodeBefore.prevSibling;
          if(nodeBefore && nodeBefore.name==="."){
            nodeBefore=nodeBefore.prevSibling;
          }
        }else{
          annotation={type: new Type(clazz,0), isStatic: method.isStatic(), topLevel: true};
        }
      }
      if(!annotation) annotation=method.typeAnnotations[nodeBefore.to];
    }
    console.log("autocomplete");
    console.log(method.typeAnnotations);
    console.log(nodeBefore.to,context.pos);
    if(annotation){
      return completeProperties(from,annotation.type,annotation.isStatic,annotation.topLevel);
    }
    return null
  };
}

function completeProperties(from, type, isStatic, includeClasses) {
  let options = [];
  if(type.dimension>0){
    options.push({
      label: "length",
      type: "variable",
      info: "Die Länge des Arrays."
    });
  }else{
    let clazz=type.baseType;
    while(clazz){
      for (let name in clazz.attributes) {
        let a=clazz.attributes[name];
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
    span: /^[\w$]*$/
  }
}