<template>
  <div id="root">
    <div id="editor" ref="editor" :style="{fontSize: (0.55*fontSize+5)+'px'}"></div>
    <Message v-if="displayedRuntimeError" severity="error" @close="dismissRuntimeError()">Z{{displayedRuntimeError.line}}: {{displayedRuntimeError.message}}</Message>
  </div>
  
</template>

<script>
import { EditorView, basicSetup } from "codemirror";
import { java } from "@codemirror/lang-java";
import { lintGutter, linter, openLintPanel, closeLintPanel } from "@codemirror/lint";
import {keymap} from "@codemirror/view";
import {indentWithTab,undo,redo} from "@codemirror/commands";
import { indentUnit } from "@codemirror/language";
import {openSearchPanel,closeSearchPanel} from '@codemirror/search';
import {autocompletion} from "@codemirror/autocomplete";
import {Compartment,StateField, StateEffect, EditorSelection,RangeSet,EditorState} from "@codemirror/state"
import {gutter, GutterMarker} from "@codemirror/view"
import {Decoration,ViewPlugin} from "@codemirror/view"
import {getClazzFromState} from '../functions/cm/getClazzFromState';
import { oneDark } from '@codemirror/theme-one-dark';

import {Type} from '../classes/Type'
import { nextTick } from '@vue/runtime-core';
// import {markerrors, errorPlugin } from '../functions/cm/markerror';
import {createAutocompletion } from '../functions/cm/autocompletion';





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
    current: Object,
    project: Object
  },
  watch: {
    clazz(nv){
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
      runtimeErrors: [],
      displayedRuntimeError: null,
      errorID: 1,
      size: 0,
      triggerRecompilation: true
    };
  },
  mounted(){
    if(this.editor) return;
    if(!this.clazz || this.clazz.src===undefined) return;
    let changed=true;
    let timer;
    this.size=this.clazz.src.length;
    const lint = linter((view) => {
      let errors=[];
      for(let i=0;i<this.clazz.errors.length;i++){
        let e=this.clazz.errors[i];
        if(!e.line){
          console.error("Fehlerhafter Fehler: ",e);
          continue;
        }
        errors.push({
          from: e.from,
          to: e.to,
          severity: "error",
          message: e.message
        });
      }
      return errors;
    });
    let editorTheme=new Compartment();
    this.editor=new EditorView({
      state: EditorState.create({
        doc: "",
        extensions: [
          basicSetup,
          //highlightActiveLine(),
          breakpointGutter,
          EditorView.lineWrapping,
          lint,
          lintGutter(),
          editorTheme.of(oneDark),
          indentUnit.of("  "),
          java(),
          autocompletion({override: [createAutocompletion()]}),
          keymap.of([indentWithTab]),
          EditorView.updateListener.of((v) => {
            if(!v.docChanged) return;
            let updateImmediately=false;
            if(!changed){
              changed=v.docChanged;
            }
            if(changed){
              if(v.transactions.length===1){
                let t=v.transactions[0];
                if(t.changes && t.changes.inserted.length>0){
                  let lastChange=t.changes.inserted[t.changes.inserted.length-1];
                  if(lastChange.text && lastChange.text.length>0){
                    let inserted=lastChange.text[0];
                    if(inserted==='.'){
                      updateImmediately=true;
                    }
                  }
                }
              }
              this.size=v.state.doc.length;
            }
            if(timer) clearTimeout(timer);
            if(updateImmediately){
              this.update(v);
              this.updateLinter();
              changed=false;
            }else{
              timer = setTimeout(() => {
                if (changed) {
                  this.update(v);
                  this.updateLinter();
                  //lint.value.source(this.editor);
                  changed=false;
                }
              }, 500 );
            }
          }),
        ]
      }),
      parent: this.$refs.editor
    });
    this.editor.component=this;
    this.setCode(this.clazz.src);
    // this.emptyTransaction();
  },
  methods: {
    updateLinter(){
      let lintPlugin=this.editor.plugins[14];
      if(lintPlugin && lintPlugin.value && lintPlugin.value.run){
        lintPlugin.value.run()
      }
    },
    async update(viewUpdate){
      var state=viewUpdate.state;
      /**direkt nach dem laden darf kein update erfolgen, sonst ist der tree (oft) fehlerhaft: */
      if(viewUpdate.changedRanges.length===1){
        let r=viewUpdate.changedRanges[0];
        if(r.fromA===0 && r.fromB===0 && r.toA===0 && r.toB===state.doc.length){
          return;
        }
      }
      var src=state.doc.toString();
      this.clazz.setSrcAndTree(src,state.tree);
      if(this.triggerRecompilation){
        this.project.compile();
        //this.$emit("recompile");
      }else{
        let t1=new Date();
        await this.clazz.compile();
        let t2=new Date();
        console.log("update parsing done in "+(t2-t1)+"ms ("+this.clazz.name+")");
      }
      this.triggerRecompilation=true;
      //this.updateErrors(viewUpdate.view);
    },
    emptyTransaction(){

      this.editor.dispatch({
      });
    },
    // updateErrors: function(view){
    //   markerrors(this.clazz.errors,view);
    //   this.emptyTransaction();
    // },
    setCode(code){
      this.triggerRecompilation=false;
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
    openLintPanel(){
      openLintPanel(this.editor);
      this.isLintPanelOpen=true;
    },
    closeLintPanel(){
      closeLintPanel(this.editor);
      this.isLintPanelOpen=false;
    },
    toggleLintPanel(){
      if(this.isLintPanelOpen){
        this.closeLintPanel();
      }else{
        this.openLintPanel();
      }
    },
    lineAt(pos){
      return this.state.doc.lineAt(pos);
    },
    prettifyCode(){
      var code=this.getCode();
      code=js_beautify(code,{
        "indent_size": 2,
        "max_preserve_newlines": 2,
        "indent_empty_lines": true,
        "space_in_paren": true,
        "space_in_empty_paren": true
      });
      this.editor.dispatch({
        changes: {from: 0, to: this.size, insert: code}
      });
    },
    slice(from,to){
      return this.editor.viewState.state.doc.slice(from,to).toString();
    },
    reset: function(sourceCode){
      this.clearRuntimeErrors();
      this.$root.sourceCode=sourceCode;
      this.editor.dispatch({
        changes: {from: 0, to: this.size, insert: this.$root.sourceCode}
      });
      this.check();
    },
    undo(){
      //undo({state: this.editor.viewState.state, dispatch: this.editor.dispatch});
      let state=this.editor;
      undo(state);
    },
    redo(){
      redo({state: this.editor.viewState.state, dispatch: this.editor.dispatch});
    },
    clearRuntimeErrors(){
      while(this.runtimeErrors.length>0){
        this.runtimeErrors.pop();
      }
      this.displayedRuntimeError=null;
    },
    dismissRuntimeError(){
      this.displayedRuntimeError=null;
      this.runtimeErrors.splice(0,1);
      setTimeout(()=>{
        if(this.runtimeErrors.length>0){
          this.displayedRuntimeError=this.runtimeErrors[0];
        }
      },200);
    },
    setRuntimeError(error){
      //this.runtimeError.pop();
      if(error){
        this.errorID++;
        this.runtimeErrors.push(error);
        if(this.runtimeErrors.length===1){
          this.displayedRuntimeError=error;
        }
      }
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
    getSelectedText: function(){

    },
    getSelectedNode: function(){
      let selection=this.editor.viewState.state.selection;
      if(selection.ranges.length!==1) return null;
      let range=selection.ranges[0];
      if(range.from>=range.to) return;
      let tree=this.editor.viewState.state.tree;
      let node=tree.resolveInner(range.from, 0);
      while(node.from<range.from || node.to>range.to){
        if(node.to<=range.from){
          if(node.nextSibling){
            node=node.nextSibling;
          }else{
            return null;
          }
        }else{
          if(node.firstChild){
            node=node.firstChild;
          }else{
            return null;
          }
        }
      }
      return node;
    },
    setCursorToEnd(){
      this.setCursor(this.size-1);
    },
    setSelection(anchor,head){
      this.setCursorToEnd();
      nextTick(()=>{
        this.editor.dispatch({
          selection: {anchor, head},
          scrollIntoView: true
        });
      });
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