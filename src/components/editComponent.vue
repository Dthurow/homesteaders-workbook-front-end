<template>
  <div id="editForm" v-if="editItem != null">
    <h3>Edit</h3>
    <form id="EditForm" >
      <div v-for="propItem in editItem.values" v-bind:key="propItem.name">
        <label v-bind:for="propItem.name">{{propItem.name}}</label><br>
        <input v-bind:required="editItem.required" v-if="propItem.type != 'select'" v-bind:type="propItem.type" v-bind:name="propItem.propName" v-model="propItem.value" />
        <select v-if="propItem.type == 'select'" v-model="propItem.value">
            <option v-for="opt in propItem.selectOptions" v-bind:key="opt" v-bind:value="opt">
                {{opt}}
            </option>
        </select>
      </div>
      <input type="button" value="Save" v-on:click="saveEdit(editItem)" />
      <a v-on:click="$emit('close-edit')" aria-label="Close">&#10006;</a>
    </form>
  </div>
</template>

<script>

import { getAccessToken } from "../js/auth";
import logging from "../js/logging";

export default {
  name: "editForm",
  data() {
    return {};
  },
  methods: {
    saveEdit: function(editItem) {
      var itemToSave = {};
      itemToSave.id = editItem.id;
      for (var index in editItem.values) {
        console.log(editItem.values[index]);
        itemToSave[editItem.values[index].propName] = editItem.values[index].value;
      }
      console.log(itemToSave);

      fetch(this.saveEditUrl, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(itemToSave)
      })
        .then(response => response.json())
        .then(savededitItem => {
          this.$emit('save-edit-return', savededitItem);
        })
        .catch(error => logging.error("Unable to update item. " + error));
    }
  },
  props: ["editItem", "saveEditUrl"]
};
</script>
