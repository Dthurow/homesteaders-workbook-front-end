<template>
  <div id="addPlantGroupComponent">
    <form id="AddForm" v-if="displayAddForm">
      <h3>Add</h3>
      <div class="formInput">
        <label for="add-name">New Plant Group Name:</label>
        <input type="text" id="add-name" v-model="addPlantGroup.name" name="name" />
      </div>
      <div class="formInput">
        <label for="add-description">New Description:</label>
        <input type="text" id="add-description" v-model="addPlantGroup.description" name="description" />
      </div>
   
      <input type="button" value="Add" v-on:click="saveNew(addPlantGroup)" />
      <input type="button" value="Cancel" v-on:click="displayAddForm = false" />
    </form>
    <div id="buttondiv" v-else>
      <input type="button" value="Add Plant Group" v-on:click="displayAddForm = true" />
    </div>
  </div>
</template>

<script>
import { config } from "../../js/config";
import { getAccessToken } from "../../js/auth";

export default {
  name: "addPlantComponent",
  data() {
    return {
      displayAddForm: false,
      uri: config.apiURL + "/api/plantgroups",
      addPlantGroup: {},
    };
  },
  methods: {
    saveNew: function(plantGroup) {
      fetch(this.uri, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(plantGroup)
      })
        .then(response => response.json())
        .then(savedPlantGroup => {
          this.$emit("save-add-plant-group-return", savedPlantGroup);
          this.addPlantGroup = {};
          this.displayAddForm = false;
        })
        .catch(error => console.error("Unable to add item.", error));
    }
  }
};
</script>

<style>
#addPlantGroupComponent form{
    border: 1px solid black;
    border-radius: 10px;
    padding:10px;
}

#addPlantGroupComponent{
    display:inline-block;
    vertical-align: middle;
}

</style>