<template>
  <div ref="editor">
  </div>
</template>

<script>
  import { EditorView, basicSetup, EditorState } from "@codemirror/basic-setup";
  import { java } from "@codemirror/lang-java";
export default {
  data(){
    return {

    };
  },
  mounted(){
    let editor=new EditorView({
      state: EditorState.create({
        doc: "Hello World",
        extensions: [
          basicSetup,
          java()
        ]
      }),
      parent: this.$refs.editor
    });
  },
  methods: {

  }
}
</script>

<style scoped>

</style>