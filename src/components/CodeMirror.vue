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
import {StateField, StateEffect} from "@codemirror/state"
import {RangeSet} from "@codemirror/rangeset"
import {gutter, GutterMarker} from "@codemirror/gutter"
import {Decoration,ViewPlugin} from "@codemirror/view"
import {Java} from '../language/java';
import {createParamsString,snippets} from '../functions/snippets'

let editor;

const completePropertyAfter = ["PropertyName", ".", "?."]
const dontCompleteIn = ["TemplateString", "LineComment", "BlockComment",
                        "VariableDefinition", "PropertyDefinition"]

function createAutocompletion(additional){
  return (context)=>{
    let nodeBefore = editor.state.tree.resolveInner(context.pos, -1);
    
    //innerhalb einer Methode?
    let method=null;
    let clazz=null;
    let n=nodeBefore;
    while(n){
      if(n.type.name==="MethodDeclaration"||n.type.name==="ConstructorDeclaration"){
        clazz=editor.component.clazz;
        if(n.name==="ConstructorDeclaration"){
          method=clazz.constructor;
        }else{
          n=n.firstChild;
          while(n && n.name!=="Definition"){
            n=n.nextSibling;
          }
          let mname=editor.state.doc.slice(n.from,n.to).text[0];
          method=clazz.methods[mname];
        }
        break;
      }
      n=n.parent;
    }
    /*
    let options=snippets.everywhere;
    if(inFunction){
      options=options.concat(snippets.inFunction);
    }else{
      options=options.concat(snippets.topLevel);
    }
    options=options.concat(additional);
    
    return {
      from,
      options,
      span: /^[\w$]*$/
    }
    */
    let from,annotation;
    if(nodeBefore.name==="Block"){
      from=context.pos;
      annotation={type: clazz, isStatic: method.isStatic(), topLevel: true};
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
          annotation={type: clazz, isStatic: method.isStatic(), topLevel: true};
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

function completeProperties(from, clazz, isStatic, includeClasses) {
  let options = []
  for (let name in clazz.attributes) {
    let a=clazz.attributes[name];
    if(a.isStatic()===isStatic){
      if(clazz.isNative()){

      }else{
        options.push({
          label: name,
          type: "variable",
          info: a.comment
        });
      }
    }
  }
  for (let name in clazz.methods) {
    let m=clazz.methods[name];
    if(m.isStatic()===isStatic){
      if(clazz.isNative()){
        let snips=snippets[clazz.name];
        let s=snips[name];
        options.push(s);
      }else{
        options.push(autocomplete.snippetCompletion(name+createParamsString(m,true),{
          label: name+"(...)",
          type: "function",
          info: m.comment
        }));
      }
    }
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
        /*Fuehrenden Whitespace herausrechnen:*/
        let pos=e.value.pos;
        let state=transaction.startState;
        let line=state.doc.lineAt(pos);
        let text=line.text;
        let wscount=0;
        if(text.trim().length>0){
          for(let i=0;i<text.length;i++){
            if(!(/\s/.test(text.charAt(i)))){
              wscount=i;
              break;
            }
          }  
        }
        //app.toggleBreakpoint(pos+wscount,!hasBreakpoint);
        app.setBreakpoint(pos+wscount,e.value.on);
        if (e.value.on){
          set = set.update({add: [breakpointMarker.range(e.value.pos)]})

        }else{
          set = set.update({filter: from => from != e.value.pos})
        }
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

const additionalCompletions=[];

export default {
  props: {
    clazz: Object,
    fontsize: {
      type: Number,
      default: 4
    }
  },
  data(){
    return {
      
    };
  },
  mounted(){
    let changed=false;
    let timer;
    editor=new EditorView({
      state: EditorState.create({
        doc: this.clazz.src,
        extensions: [
          basicSetup,
          //highlightActiveLine(),
          breakpointGutter,
          EditorView.lineWrapping,
          indentUnit.of("  "),
          java(),
          autocompletion({override: [createAutocompletion(additionalCompletions)]}),
          keymap.of([indentWithTab]),
          EditorView.updateListener.of((v) => {
            if(!changed){
              changed=v.docChanged;
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
    editor.component=this;
  },
  methods: {
    async update(viewUpdate){
      var state=viewUpdate.state;
      var src=state.doc.toString();
      this.clazz.setSrcTreeAndState(src,state);
      await this.clazz.compile(this.project);
    },
    setClazz(clazz){
      this.clazz=clazz;
      var old=this.editor.state.doc.toString();
      editor.dispatch({
        changes: {from: 0, to: old.length, insert: clazz.src}
      });
    },
    openSearchPanel(){
      openSearchPanel(editor);
      this.isSearchPanelOpen=true;
    },
    closeSearchPanel(){
      closeSearchPanel(editor);
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
    slice(from,to){
      return this.state.doc.slice(from,to);
    },
    reset: function(sourceCode){
      this.runtimeError=null;
      this.$root.sourceCode=sourceCode;
      editor.dispatch({
        changes: {from: 0, to: this.size, insert: this.$root.sourceCode}
      });
      this.check();
    },
    undo(){
      undo({state: editor.viewState.state, dispatch: editor.dispatch});
    },
    redo(){
      redo({state: editor.viewState.state, dispatch: editor.dispatch});
    },
    setRuntimeError: function(error){
      this.runtimeError=error;
    },
    insert(text){
      let pos=editor.state.selection.ranges[0].from;
      editor.dispatch({
        changes: {from: pos, to: pos, insert: text}
      });
      editor.focus();
    },
    setCursor: function(position){
      //editor.focus();
      editor.dispatch({
        selection: new EditorSelection([EditorSelection.cursor(position)], 0),
        scrollIntoView: true
      });
    },
    setSelection(anchor,head){
      editor.dispatch({
        selection: {anchor, head},
        scrollIntoView: true
      })
    },
    focus(){
      editor.focus();
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