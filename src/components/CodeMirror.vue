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
  import {keymap} from "@codemirror/view"
  import {indentWithTab} from "@codemirror/commands"
let editor;

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
          java(),
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