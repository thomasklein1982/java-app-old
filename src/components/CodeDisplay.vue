<template>
  <table style="width:100%;font-family: monospace;white-space: pre-wrap;">
    <tr v-for="(l,i) in lines">
      <td style="text-align: right"><span style="display: inline-block;margin-right: 2rem;">{{i+1}}</span></td>
      <td :style="{flex: 1}" style="">{{l}}</td>
    </tr>
  </table>
</template>

<script>
export default {
  props: {
    code: String
  },
  computed: {
    lines(){
      let s=this.code.split("\n");
      return s;
    },
    lineNumbers(){
      
      for(let i=0;i<s.length;i++){
        s[i]=i+1;
      }
      return s.join("\n");
    },
  },
  data(){
    return {

    };
  }
};
</script>