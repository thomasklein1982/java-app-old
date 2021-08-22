<template>
  <div id="root">
    <transition name="fade">
      <Button @click="show=true" v-show="!show" style="position: absolute; left: 0; top: 50%" icon="pi pi-chevron-right" id=""></Button>
    </transition>
    <transition name="fade">
      <Panel class="panel-full" id="panel" v-show="show">
        <template #header>
          Projekt-Explorer
        </template>
        <template #icons>
          <Button class="p-button-rounded p-button-text" icon="pi pi-times" @click="show=false"/>
        </template>
        Hallo

      </Panel>
    </transition>
  </div>
</template>

<script>
export default {
  data(){
    return {
      show: true
    };
  }
}
</script>

<style scoped>
  #root{
    display: flex;
    flex-direction: column;
  }
  #panel{
    flex: 1;
  }
</style>>