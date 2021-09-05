<template>
  <div class="umlmember">
    <span class="umlmember-modifiers"><span v-if="member.modifiers.visibility==='private'">&minus;</span><span v-else>+</span><sup class="static" v-if="member.isStatic()">S</sup></span>&nbsp;<span class="umlmember-signature">{{member.getSignatureString()}}</span>
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
.umlmember{
  display: flex;
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