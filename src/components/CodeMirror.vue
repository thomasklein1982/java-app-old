<template>
  <div id="root">
    <div id="editor" ref="editor" :style="{fontSize: (0.55*fontSize+5)+'px'}"></div>
    <div v-if="clazz && clazz.errors" id="errors">
      <table>
        <tr v-for="(e,i) in clazz.errors" :key="'error'+i">
          <template v-if="e">
            <td>{{e.line? e.line.number:'??'}}:{{e.col}}:</td><td v-if="e">{{e.message}} </td>
          </template>
        </tr>
      </table>
    </div>
    <Message v-for="(e,i) in runtimeError" severity="error" :key="'re'+errorID">Z{{e.line}}: {{e.message}}</Message>
  </div>
  
</template>

<script>
import { EditorView, basicSetup, EditorState } from "@codemirror/basic-setup";
import { java } from "@codemirror/lang-java";
import {keymap} from "@codemirror/view";
import {indentWithTab} from "@codemirror/commands";
import { indentUnit } from "@codemirror/language";
import  * as autocomplete  from "@codemirror/autocomplete";
import {CompletionContext} from "@codemirror/autocomplete";
import {autocompletion} from "@codemirror/autocomplete";
import {StateField, StateEffect, EditorSelection} from "@codemirror/state"
import {RangeSet} from "@codemirror/rangeset"
import {gutter, GutterMarker} from "@codemirror/gutter"
import {Decoration,ViewPlugin} from "@codemirror/view"
import {Java} from '../language/java';
import {createParamsString,snippets} from '../functions/snippets'
import {Type} from '../classes/Type'
import { nextTick } from '@vue/runtime-core';
import {markerrors, errorPlugin } from '../functions/markerror';

const completePropertyAfter = ["PropertyName", ".", "?."]
const dontCompleteIn = ["TemplateString", "LineComment", "BlockComment",
                        "VariableDefinition", "PropertyDefinition"]

function getClazzFromState(state){
  let clazz=null;
  try{
    let node=state.tree.topNode.firstChild;
    while(node && node.name!=="ClassDeclaration"){
      node=node.nextSibling;
    }
    if(node){
      node=node.firstChild;
      while(node && node.name!=="Definition"){
        node=node.nextSibling;
      }
      let clazzname=state.doc.sliceString(node.from,node.to);
      clazz=app.getProject().getClazzByName(clazzname);
    }
  }catch(e){
    console.error(e);
  }
  return clazz;
}

function createAutocompletion(additional){
  return (context)=>{
    let nodeBefore = context.state.tree.resolveInner(context.pos, -1);
    
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
          let mname=context.state.doc.sliceString(n.from,n.to);
          method=clazz.methods[mname];
        }
        break;
      }
      n=n.parent;
    }
    if(!method) return;
    let from,annotation;
    if(nodeBefore.name==="ObjectCreationExpression"){
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
    /*
    if (completePropertyAfter.includes(nodeBefore.name) &&
        nodeBefore.parent?.name == "MemberExpression") {
      let object = nodeBefore.parent.getChild("Expression");
      if (object?.name == "VariableName") {
        let from = /\./.test(nodeBefore.name) ? nodeBefore.to : nodeBefore.from;
        let variableName = context.state.sliceDoc(object.from, object.to);
        if (typeof window[variableName] == "object"){
          return completeProperties(from, window[variableName]);
        }
      }
    } else if (nodeBefore.name == "Identifier") {
      console.log('variable name')
      return completeProperties(nodeBefore.from, window)
    } else if (context.explicit && !dontCompleteIn.includes(nodeBefore.name)) {
      console.log("nichts")
      return completeProperties(context.pos, window)
    }
    */
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

const breakpointEffect = StateEffect.define({
  map: (val, mapping) => ({pos: mapping.mapPos(val.pos), on: val.on})
})

const breakpointState = StateField.define({
  create() { return RangeSet.empty },
  update(set, transaction) {
    set = set.map(transaction.changes)
    for (let e of transaction.effects) {
      if (e.is(breakpointEffect)) {
        if (e.value.on){
          set = set.update({add: [breakpointMarker.range(e.value.pos)]})

        }else{
          set = set.update({filter: from => from != e.value.pos})
        }
        let clazz=getClazzFromState(transaction.startState);
        app.updateBreakpoints(set,transaction.startState.doc,clazz);
      }
    }
    return set
  }
})

function toggleBreakpoint(view, line) {
  let pos=line.from;
  line=view.state.doc.lineAt(pos)
  let breakpoints = view.state.field(breakpointState);
  let hasBreakpoint = false;
  breakpoints.between(pos, pos, () => {hasBreakpoint = true});
  view.dispatch({
    effects: breakpointEffect.of({pos, on: !hasBreakpoint})
  });
  
}

const breakpointMarker = new class extends GutterMarker {
  toDOM() { return document.createTextNode("⬤") }
}

const breakpointGutter = [
  breakpointState,
  gutter({
    class: "cm-breakpoint-gutter",
    markers: v => v.state.field(breakpointState),
    initialSpacer: () => breakpointMarker,
    domEventHandlers: {
      mousedown(view, line) {
        toggleBreakpoint(view, line)
        return true
      }
    }
  }),
  EditorView.baseTheme({
    ".cm-breakpoint-gutter .cm-gutterElement": {
      color: "red",
      paddingLeft: "5px",
      cursor: "default"
    },
    ".cm-currentLine": {backgroundColor: "#121212", color: "white"}
  })
]

const errorEffect = StateEffect.define({
  map: (val, mapping) => ({pos: mapping.mapPos(val.pos), on: val.on})
})

const errorState = StateField.define({
  create() { return RangeSet.empty },
  update(set, transaction) {
    set = set.map(transaction.changes)
    for (let e of transaction.effects) {
      if (e.is(errorEffect)) {
        if (e.value.on){
          set = set.update({add: [errorMarker.range(e.value.pos)]})

        }else{
          set = set.update({filter: from => from != e.value.pos})
        }
        // let clazz=getClazzFromState(transaction.startState);
        // app.updateBreakpoints(set,transaction.startState.doc,clazz);
      }
    }
    return set
  }
})

const errorMarker = new class extends GutterMarker {
  toDOM() { return document.createTextNode("!") }
}

const errorGutter = [
  errorState,
  gutter({
    class: "cm-breakpoint-gutter",
    markers: v => v.state.field(errorState),
    initialSpacer: () => errorMarker
  }),
  EditorView.baseTheme({
    ".cm-error-gutter .cm-gutterElement": {
      color: "red",
      paddingLeft: "5px",
      cursor: "default"
    },
    ".cm-currentLine": {backgroundColor: "#121212", color: "white"}
  })
]

const additionalCompletions=[];

export default {
  props: {
    clazz: Object,
    fontSize: {
      type: Number,
      default: 4
    },
    current: Object
  },
  watch: {
    clazz(nv){
      console.log("neuer Code"),
      this.setCode(nv.src);
    },
    current(nv,ov){
      if(nv===null && ov!==null){
        this.setCursorToLine(ov.line);
      }else if(nv.line<1){
        this.setCursorToLine(ov.line);
      }else{
        let line=this.getLineByNumber(nv.line);
        try{
          this.setSelection(line.from,line.to+1);
        }catch(e){
          this.setSelection(line.from,line.to);
        }
      // currentLineHighlighter.update()
      }
    }

  },
  data(){
    return {
      runtimeError: [],
      errorID: 1,
      size: 0
    };
  },
  mounted(){
    let changed=true;
    let timer;
    this.size=this.clazz.src.length;
    this.editor=new EditorView({
      state: EditorState.create({
        doc: this.clazz.src,
        extensions: [
          basicSetup,
          errorPlugin,
          //highlightActiveLine(),
          breakpointGutter,
          EditorView.lineWrapping,
          indentUnit.of("  "),
          java(),
          autocompletion({override: [createAutocompletion(additionalCompletions)]}),
          keymap.of([indentWithTab]),
          EditorView.updateListener.of((v) => {
            console.log("codemirror update")
            if(!changed){
              changed=v.docChanged;
            }
            if(changed){
              this.size=v.state.doc.length;
            }
            if(timer) clearTimeout(timer);
            timer = setTimeout(() => {
              if (changed) {
                this.update(v);
                changed=false;
              }
            }, 500 );
          }),
        ]
      }),
      parent: this.$refs.editor
    });
    this.editor.component=this;
    this.emptyTransaction();
  },
  methods: {
    async update(viewUpdate){
      var state=viewUpdate.state;
      var src=state.doc.toString();
      this.clazz.setSrcTreeAndState(src,state);
      let t1=new Date();
      await this.clazz.compile(this.project);
      let t2=new Date();
      console.log("update parsing done in "+(t2-t1)+"ms");
      this.updateErrors(viewUpdate.view);
    },
    emptyTransaction(){
      this.editor.dispatch({
      });
    },
    updateErrors: function(view){
      markerrors(this.clazz.errors,view);
      this.emptyTransaction();
    },
    setCode(code){
      this.size=code.length;
      var old=this.editor.state.doc.toString();
      this.editor.dispatch({
        changes: {from: 0, to: old.length, insert: code}
      });
    },
    getCode(){
      return this.editor.state.doc.toString();
    },
    openSearchPanel(){
      openSearchPanel(this.editor);
      this.isSearchPanelOpen=true;
    },
    closeSearchPanel(){
      closeSearchPanel(this.editor);
      this.isSearchPanelOpen=false;
    },
    toggleSearchPanel(){
      if(this.isSearchPanelOpen){
        this.closeSearchPanel();
      }else{
        this.openSearchPanel();
      }
    },
    lineAt(pos){
      return this.state.doc.lineAt(pos);
    },
    prettifyCode(){
      var code=this.getCode();
      code=js_beautify(code,{
        "indent_size": 2,
        "preserve_newlines": false,
        "space_in_paren": true,
        "space_in_empty_paren": true
      });
      this.editor.dispatch({
        changes: {from: 0, to: this.size, insert: code}
      });
    },
    slice(from,to){
      return this.state.doc.slice(from,to);
    },
    reset: function(sourceCode){
      this.runtimeError=null;
      this.$root.sourceCode=sourceCode;
      this.editor.dispatch({
        changes: {from: 0, to: this.size, insert: this.$root.sourceCode}
      });
      this.check();
    },
    undo(){
      undo({state: this.editor.viewState.state, dispatch: this.editor.dispatch});
    },
    redo(){
      redo({state: this.editor.viewState.state, dispatch: this.editor.dispatch});
    },
    setRuntimeError: function(error){
      console.log(this.runtimeError);
      this.errorID++;
      this.runtimeError.pop();
      this.runtimeError.push(error);
    },
    insert(text){
      let pos=this.editor.state.selection.ranges[0].from;
      this.editor.dispatch({
        changes: {from: pos, to: pos, insert: text}
      });
      this.focus();
    },
    setCursor: function(position){
      //editor.focus();
      this.editor.dispatch({
        selection: new EditorSelection([EditorSelection.cursor(position)], 0),
        scrollIntoView: true
      });
    },
    setCursorToLine: function(linenumber){
      if(linenumber<1) return;
      let line=this.getLineByNumber(linenumber);
      this.setCursor(line.from);
    },
    getLineByNumber: function(linenumber){
      return this.editor.state.doc.line(linenumber);
    },
    setSelection(anchor,head){
      this.editor.dispatch({
        selection: {anchor, head},
        scrollIntoView: true
      })
    },
    focus(){
      this.editor.focus();
    }
  }
}
</script>

<style scoped>
  #root{
    flex: 10;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  #editor{
    flex: 1;
    overflow-y:auto;
    display: flex;
    flex-direction: column;
  }
  #errors{
    color: red;
  }
</style>

<style>
  .cm-editor{
    flex: 1;
  }
  #errors{
    font-family: monospace;
  }
  
</style>