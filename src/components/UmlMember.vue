<template>
  <div class="umlmember" @click="click()">
    <span class="umlmember-modifiers"><span v-if="member.modifiers.visibility==='private'">&minus;</span><span v-else>+</span><sup class="static" v-if="member.isStatic()">S</sup></span>&nbsp;<span class="umlmember-signature">{{member.getSignatureString()}}</span>
  </div>
</template>

<script>
import { nextTick } from '@vue/runtime-core';
export default {
  props: {
    member: Object
  },
  methods: {
    click(){
      let editor=this.$root.$refs.editor;
      let index=editor.project.getClazzIndexByName(this.member.clazz.name);
      editor.activeTab=index;
      console.log(editor);
      let cm=editor.$refs.editor[index];
      cm.setSelection(this.member.node.from,this.member.node.to);
      nextTick(()=>{
          cm.focus()
        }
      );
    }
  }
}
</script>

<style scoped>
.umlmember{
  display: flex;
  cursor: pointer;
}
.umlmember-signature{
  max-width: 15rem;
  display: inline-block;
  flex: 1;
  font-family: monospace;
  align-self: flex-end;
}
.umlmember-modifiers{
  display: inline-block;
  width: 1rem;
}
.static{
  font-size: small;
}
</style>