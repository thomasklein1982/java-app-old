<template>
  <div id="root">
    <div id="editor" ref="editor"></div>
    <div v-if="clazz && clazz.errors" id="errors">
      <table>
        <tr v-for="(e,i) in clazz.errors" :key="'error'+i">
          <td>Zeile {{e.line.number}}, Spalte {{e.col}}:</td><td>{{e.message}} </td>
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
export default {
  data(){
    return {
      clazz: null,
      editor: null
    };
  },
  mounted(){
    let changed=false;
    let timer;
    let editor=new EditorView({
      state: EditorState.create({
        doc: "Hello World",
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
    this.editor=editor;
  },
  methods: {
    async update(viewUpdate){
      var state=viewUpdate.state;
      var src=state.doc.toString();
      this.clazz.setSrcTreeAndState(src,state);
      await this.clazz.compile();
      console.log(this.clazz.toString());

    },
    setClazz(clazz){
      this.clazz=clazz;
      var old=this.editor.state.doc.toString();
      this.editor.dispatch({
        changes: {from: 0, to: old.length, insert: clazz.src}
      });
    }
  }
}
</script>

<style scoped>
  #root{
    flex: 1;
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
</style>