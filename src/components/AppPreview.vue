<template>
  <div :style="{flex: 1}" style="position: relative; width: 100%; height: 100%;">
    <div ref="wrapper" style="width: 100%; height: 100%;"></div>
    <div v-if="paused" style="position: absolute; top: 3px; right: 3px">Angehalten...</div>
  </div>
</template>
<script>
  export default {
    props: {
      project: Object,
      paused: {
        type: Boolean,
        default: false
      }
    },
    data: function(){
      return {
        frame: null,
        breakpoints: null
      }
    },
    methods: {
      focus(){
        if(this.frame){
          this.frame.focus();
        }
      },
      setBreakpoints(bp){
        //console.log("set bp", bp);
        this.breakpoints=bp;
        if(this.frame){
          this.frame.contentWindow.postMessage({
            type: "breakpoints",
            breakpoints: bp
          });
        }
      },
      resume(){
        if(this.frame){
          this.frame.contentWindow.postMessage({
            type: "debug-resume"
          });
        }
        this.focus();
      },
      step(){
        this.frame.contentWindow.postMessage({
          type: "debug-step"
        });
        this.focus();
      },
      stop(){
        if(this.$refs.wrapper.firstChild){
          this.$refs.wrapper.removeChild(this.$refs.wrapper.firstChild);
        }
        this.frame=null;
      },
      reload(){
        let frame=document.createElement('iframe');
        frame.style="width: 100%; height: 100%;";
        if(this.$refs.wrapper.firstChild){
          this.$refs.wrapper.removeChild(this.$refs.wrapper.firstChild);
        }
        this.$refs.wrapper.appendChild(frame);
        let code=this.project.getFullAppCode("$App.debug.setBreakpoints("+JSON.stringify(this.breakpoints)+");");
        console.log("komplett:")
        console.log(code);
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