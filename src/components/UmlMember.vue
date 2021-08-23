<template>
  <div>
    <span v-if="member.modifiers.visibility==='private'">&minus;</span><span v-else>+</span><sup id="static" v-if="member.modifiers.isStatic">S</sup> {{member.getSignatureString()}} 
  </div>
</template>

<script>
export default {
  props: {
    member: Object
  }
}
</script>

<style scoped>
#static{
  font-size: small;
}
</style>