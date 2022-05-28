<template>
  <Dialog header="Relation importieren" v-model:visible="dialogs.importRelation.show" :modal="true">
    <p>In die folgende TextArea kannst du Daten einfügen, die du z. B. aus Excel kopiert hast.</p>
    <div class="field">
      <TextArea rows="5" cols="30" autofocus v-model="dialogs.importRelation.text" />
    </div>
    <div v-if="importedRelation" class="field">
      <p>Erkannt: Relation ({{importedRelation.getAttributeNames()}}) mit {{importedRelation.records.length}} Datensätzen</p>
      ACHTUNG: Durch Klick auf 'OK' wird die alte Relation gelöscht und durch die neuen Daten ersetzt.
    </div>
    <template #footer>
      <Button :disabled="!importedRelation" @click="confirmImportRelation()" label="OK"/>
      <Button @click="dialogs.importRelation.show=false" class="p-button-outlined" label="Abbrechen"/>
    </template>
  </Dialog>
  <Dialog header="Neues Attribut" v-model:visible="dialogs.newAttribute.show" :modal="true">
    <div class="field">
      <label for="relationname">Name</label>
      <InputText autofocus id="relationname" v-model="dialogs.newAttribute.name" type="text" />
    </div>
    <div class="field">
      <label for="datatype">Datentyp</label>
      <Dropdown id="datatype" optionLabel="name" v-model="dialogs.newAttribute.datatype" :options="datatypes" />
    </div>
    <template #footer>
      <Button @click="confirmNewAttribute(dialogs.newAttribute.name,dialogs.newAttribute.datatype)" label="OK"/>
      <Button @click="dialogs.newAttribute.show=false" class="p-button-outlined" label="Abbrechen"/>
    </template>
  </Dialog>
  <Dialog header="Attribut bearbeiten" v-model:visible="dialogs.editAttribute.show">
    <div class="field">
      <label for="relationname">Name</label>
      <InputText id="relationname" v-model="dialogs.editAttribute.name" type="text" />
    </div>
    <div class="field">
      <label for="datatype">Datentyp</label>
      <Dropdown id="datatype" optionLabel="name" v-model="dialogs.editAttribute.datatype" :options="datatypes" />
    </div>
    <template #footer>
      <Button @click="confirmEditAttribute(dialogs.editAttribute.name,dialogs.editAttribute.datatype)" label="OK"/>
      <Button @click="dialogs.editAttribute.show=false" class="p-button-outlined" label="Abbrechen"/>
    </template>
  </Dialog>
  <Dialog @hide="applyChanges()" :header="'Relation '+relation.name+' bearbeiten'" v-model:visible="show">
    <div>
      <label style="margin-right: 0.5rem" for="relationname">Name</label>
      <InputText id="relationname" v-model="name" type="text" />
      <small style="display: block">{{errorMessage}}</small>
    </div>
    <table class="database-table">
      <ConfirmPopup/>
      <tr>
        <th v-for="(a,i) in relation.attributes">
          <SplitButton :label="a.name" :icon="a.type.icon" :model="getAttributeItems(a)"/>
        </th>
        <th><Button @click="dialogs.newAttribute.show=true" icon="pi pi-plus"/></th>
      </tr>
      <tr v-for="(r,j) in relation.records">
        <td v-for="(a,i) in relation.attributes">
          <span v-if="j===currentRecord">
            <InputText v-model="r[i]"/>
          </span>
          <span v-else>{{r[i]}}</span>
        </td>
        <td><Button v-if="showTrash" class="p-button-outlined" @click="trashRecord(j)" icon="pi pi-trash"/><Button v-else-if="j===currentRecord" class="p-button-outlined" @click="stopEditRecord()" icon="pi pi-times"/><Button v-else class="p-button-outlined" @click="editRecord(j)" icon="pi pi-pencil"/></td>
      </tr>
    </table>
    <Button @click="relation.appendNewRecord()" label="Neuer Datensatz"/>
    <ToggleButton v-model="showTrash" onLabel="Löschen freigegeben" offLabel="Löschen nicht freigegeben"/>
    <Button @click="dialogs.importRelation.show=true" label="Importieren"/>
  </Dialog>
</template>

<script>
  import {Database} from "../classes/Database";
  import {Table} from "../classes/Table";
  import SplitButton from 'primevue/splitbutton';

  export default {
    props: {
      relation: Object
    },
    computed: {
      importedRelation(){
        console.log("update");
        return this.parseRelationFromText(this.dialogs.importRelation.text);
      },
      errorMessage(){
        if(this.name!==this.relation.name){
          let t=this.relation.database.getTableByName(this.name);
          if(t){
            return "Es gibt bereits eine Relation mit diesem Namen.";
          }
        }
        return "";
      },
      datatypes(){
        return [
          Database.String, Database.Numeric, Database.Date
        ]
      }
    },
    data(){
      return {
        dialogs: {
          newAttribute: {
            show: false,
            name: "",
            datatype: Database.String,
            isPrimaryKey: false
          },
          editAttribute: {
            show: false,
            name: "",
            datatype: Database.String,
            isPrimaryKey: false
          },
          importRelation: {
            show: false,
            text: ''
          }
        },
        currentRecord: null,
        currentAttribute: null,
        showTrash: false,
        show: false,
        name: this.relation.name
      }
    },
    methods: {
      parseRelationFromText(text){
        var relation=new Table(this.relation.database,this.name);
        var ok=relation.fromCSVString("import\n"+text,"\t");
        if(ok){
          return relation;
        }else{
          return null;
        }
      },
      editRecord(index){
        this.currentRecord=index;
      },
      trashRecord(index){
        this.relation.records.splice(index,1);
      },
      stopEditRecord(){
        this.currentRecord=null;
      },
      getAttributeItems(a){
        return [
          {
            label: 'Bearbeiten',
            icon: 'pi pi-pencil',
            command: (event) => {
              this.dialogs.editAttribute.name=a.name;
              this.dialogs.editAttribute.type=a.type;
              this.currentAttribute=a;
              this.dialogs.editAttribute.show=true;
            }
          },
          {
            label: 'Entfernen',
            icon: 'pi pi-trash',
            command: (event) => {
              var ans=confirm("Willst du das Attribut '"+a.name+"' wirklich löschen?\nAlle zugehörigen Daten werden gelöscht!");
              if(ans){
                this.relation.removeAttribute(a);
              }
            }
          }
        ]
      },
      setVisible(v){
        if(v===false){
          this.applyChanges();
        }
        this.show=v;
      },
      applyChanges(){
        if(!this.errorMessage){
          this.relation.name=this.name;
        }
      },
      confirmNewAttribute(name,datatype){
        this.relation.addAttribute(name,datatype);
        this.dialogs.newAttribute.show=false;
      },
      confirmEditAttribute(name,datatype){
        this.currentAttribute.name=name;
        this.currentAttribute.type=datatype;
        this.dialogs.editAttribute.show=false;
      },
      confirmImportRelation(){
        this.relation.fromTable(this.importedRelation);
        this.dialogs.importRelation.show=false;
      }
    },
    components: {
      SplitButton
    }
  }
</script>

<style scoped>
  .field *{
    margin-right: 0.5rem
  }
</style>