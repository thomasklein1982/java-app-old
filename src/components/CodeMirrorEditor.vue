<template>
  <div id="root">
    <div id="editor" ref="editor"></div>
  </div>
  
</template>

<script>
import { EditorView, basicSetup } from "codemirror";
import { css, cssCompletionSource } from "@codemirror/lang-css";
import { lintGutter, linter, openLintPanel, closeLintPanel } from "@codemirror/lint";
import {keymap} from "@codemirror/view";
import {indentWithTab,redo,undo} from "@codemirror/commands";
import { indentUnit } from "@codemirror/language";
import {openSearchPanel,closeSearchPanel} from '@codemirror/search';
import {EditorState} from '@codemirror/state';
import {autocompletion} from "@codemirror/autocomplete";
import {gutter, GutterMarker} from "@codemirror/view"
import {Decoration,ViewPlugin} from "@codemirror/view"

import { nextTick } from '@vue/runtime-core';




export default {
  props: {
    project: Object,
  },
  data(){
    return {
      editor: null
    };
  },
  mounted(){
    let changed=true;
    let timer;
    this.editor=new EditorView({
      state: EditorState.create({
        doc: this.project.css,
        extensions: [
          basicSetup,
          EditorView.lineWrapping,
          lintGutter(),
          indentUnit.of("  "),
          // css().language,
          // autocompletion({override: [cssCompletionSource]}),
          keymap.of([indentWithTab]),
          EditorView.updateListener.of((v) => {
            this.project.css=this.getCode();
          }),
        ]
      }),
      parent: this.$refs.editor
    });
    this.editor.component=this;
  },
  methods: {
    
    getCode(){
      return this.editor.state.doc.toString();
    },
    undo(){
      undo({state: this.editor.viewState.state, dispatch: this.editor.dispatch});
    },
    redo(){
      redo({state: this.editor.viewState.state, dispatch: this.editor.dispatch});
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