<template>
  <div v-if="editPlantGroup != null">
    <h3>Edit</h3>
    <form id="EditForm">
        <div class="formInput">
          <label for="edit-name">New Plant Group Name:</label>
          <input type="text" id="edit-name" v-model="editPlantGroup.name" name="name" />
        </div>
        <div class="formInput">
          <label for="edit-description">New Description:</label>
          <input
            type="text"
            id="edit-description"
            v-model="editPlantGroup.description"
            name="description"
          />
        </div>
      <input type="button" value="Save" v-on:click="saveEdit(editPlantGroup)" />
      <input type="button" value="Cancel" v-on:click="$emit('close-edit')" />
    </form>
  </div>
</template>

<script>
import { getAccessToken } from "../../js/auth";
import logging from "../../js/logging";

export default {
  name: "editPlantGroupComponent",
  props: ["uri", "editPlantGroup"],
  data() {
    return {
    };
  },
  methods: {
    saveEdit: function(plantGroup) {
      fetch(this.uri+ "/" + plantGroup.id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(plantGroup)
      })
        .then(response => response.json())
        .then(savedPlantGroup => {
          this.$emit("save-edit-plant-group-return", savedPlantGroup);
        })
        .catch(error => logging.error("Unable to update plant group id:" + plantGroup.id + " " + error));
    }
  }
};
</script>

<style>
</style>