<template>
  <div :style="{flex: 1}" style="position: relative; width: 100%; height: 100%;">
    <div ref="wrapper" style="width: 100%; height: 100%;"></div>
  </div>
</template>
<script>
  export default {
    props: {
      uiClazz: Object
    },
    data: function(){
      return {
        frame: null
      }
    },
    methods: {
      focus(){
        if(this.frame){
          this.frame.focus();
        }
      },
      reload(){
        let frame=document.createElement('iframe');
        frame.style="width: 100%; height: 100%;";
        if(this.$refs.wrapper.firstChild){
          this.$refs.wrapper.removeChild(this.$refs.wrapper.firstChild);
        }
        this.$refs.wrapper.appendChild(frame);
        let code=this.uiClazz.getUIPreviewCode();
        console.log("uipreview",code);
        let doc=frame.contentWindow.document;
        doc.open();
        doc.write(code);
        doc.close();
        this.frame=frame;
        this.focus();
      }
    }
  }
</script>