<template>
  <div id="editForm" v-if="editGarden != null">
    <h3>Edit</h3>
    <form id="EditForm">
      <input type="hidden" name="ID" v-model="editGarden.id" id="edit-id" />
      <div class="formInput">
        <label for="edit-name">Garden Name</label>
        <input
          type="text"
          id="edit-name"
          v-model="editGarden.name"
          name="name"
        />
      </div>
      <div class="formInput">
        <label for="edit-growing-start-date">Growing Season Start Date (approximate)</label>
        <input
          type="date"
          id="edit-growing-start-date"
            v-bind:value="editGarden.growingSeasonStartDate && (new Date(editGarden.growingSeasonStartDate)).toISOString().split('T')[0]"
            v-on:input="editGarden.growingSeasonStartDate = $event.target.value"
          name="growingSeasonStartDate"
          placeholder="Growing Season Start Date"
        />
      </div>
      <div class="formInput">
        <label for="edit-growing-end-date">Growing Season End Date (approximate)</label>
        <input
          type="date"
          id="edit-growing-end-date"
            v-bind:value="editGarden.growingSeasonEndDate && (new Date(editGarden.growingSeasonEndDate)).toISOString().split('T')[0]"
            v-on:input="editGarden.growingSeasonEndDate = $event.target.value"
          
          name="growingSeasonEndDate"
          placeholder="Growing Season End Date"
        />
      </div>
      <div class="formInput">
        <label for="edit-size">Garden Size:</label>
        <input type="number" v-model="editGarden.width" placeholder="width" />
        <input type="number" v-model="editGarden.length" placeholder="length" />
        <select v-model="editGarden.measurementType" id="edit-measurementType">
          <option
            v-for="measurementType in measurementTypes"
            v-bind:key="measurementType.id"
            v-bind:value="measurementType.name"
          >{{measurementType.name}}</option>
        </select>
      </div>
      <input type="button" value="Save" v-on:click="saveEdit(editGarden)" />
      <input type="button" value="Cancel" v-on:click="$emit('close-edit')" />
    </form>
  </div>
</template>

<script>
import { getAccessToken } from "../../js/auth";
import { MeasurementTypes } from "../../js/enums";

export default {
  name: "editGardenComponent",
  props: ["uri", "editGarden"],
  data() {
    return {
      measurementTypes: MeasurementTypes
    };
  },
  methods:{
      saveEdit: function(garden) {
      fetch(this.uri + "/" + garden.id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(garden)
      })
        .then(response => response.json())
        .then(savedgarden => {
            this.$emit("save-edit-return", savedgarden);
        })
        .catch(error => console.error("Unable to update item.", error));
    }
  }
};
</script>

<style>
</style>