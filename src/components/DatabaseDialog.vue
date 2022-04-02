<template>
<Dialog header="Datenbank" v-model:visible="show" :modal="true" class="p-dialog-maximized">
  <DatabaseNewRelationDialog 
    ref="dialogNewRelation"
    @confirm="addRelation"
  />
  <Splitter :style="{flex: 1}" style="overflow: hidden;width: 100%;height: 100%;">
    <SplitterPanel style="overflow: hidden;" :style="{display: 'flex', flexDirection: 'column'}">
      <div :style="{flex: 1}">
        <DatabaseRelation 
          :key="i" 
          v-for="(r,i) in relations"
          :relation="r"
        />
      </div>
      <div style="text-align: right">
        <Button @click="$refs.dialogNewRelation.setVisible(true)" label="Neue Relation"/>
      </div>
    </SplitterPanel>
    <SplitterPanel style="overflow: hidden;" :style="{display: 'flex', flexDirection: 'column'}">
      <div :style="{flex: 1}">

      </div>
      <Textarea :rows="6" v-model="sqlcommand" autoresize/>
    </SplitterPanel>
  </Splitter>
  
  
</Dialog>
</template>

<script>
import DatabaseRelation from "./DatabaseRelation.vue";
import Textarea from 'primevue/textarea';
import DatabaseNewRelationDialog from "./DatabaseNewRelationDialog.vue";

export default {
  props: {
    database: Object
  },
  data(){
    return {
      show: false,
      sqlcommand: ""
    };
  },
  computed: {
    relations(){
      if(this.database){
        return this.database.tables;
      }else{
        return [];
      }
    }
  },
  methods: {
    setVisible(v){
      this.show=v;
    },
    addRelation(name){
      this.database.addTable(name);
    }
  },
  components: {
    DatabaseRelation,
    Textarea,
    DatabaseNewRelationDialog
  }
}
</script>