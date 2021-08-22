<template>
  <div id="editor" ref="editor">
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
      errors: [],
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
      this.errors=[];
      var state=viewUpdate.state;
      var src=state.doc.toString();
      this.clazz.setSrcTreeAndState(src,state);
      this.errors=await this.clazz.compile();
      console.log(this.clazz.toString());
      console.log(this.errors);
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
  #editor{
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
</style>