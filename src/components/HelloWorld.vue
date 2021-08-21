<template>
  <h1>{{ msg }}</h1>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Documentation
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
  </p>
  <code-mirror></code-mirror>

  
  <button type="button" @click="state.count++">
    count is: {{ state.count }}
  </button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement. hab ich a nicht?
  </p>
  <Button label="Test! 123" icon="pi pi-file"></Button>
  <Dialog :visible="true"></Dialog>
</template>

<script setup>
import { defineProps, reactive } from 'vue'
import CodeMirror from "./CodeMirror.vue";

console.log(CodeMirror);

defineProps({
  msg: String
})

const state = reactive({ count: 0 })
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
