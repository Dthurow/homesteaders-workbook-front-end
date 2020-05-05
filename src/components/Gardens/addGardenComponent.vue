<template>
  <div>
    <div v-if="displayAddForm">
      <h3>Add</h3>
      <form id="AddForm">
        <div class="formInput">
          <label for="add-name">Garden Name</label>
          <input
            type="text"
            id="add-name"
            v-model="addGarden.name"
            name="name"
            placeholder="New garden name"
          />
        </div>
        <div class="formInput">
          <label for="add-growing-start-date">Growing Season Start Date (approximate)</label>
          <input
            type="date"
            id="add-growing-start-date"
            v-model="addGarden.growingSeasonStartDate"
            name="growingSeasonStartDate"
            placeholder="Growing Season Start Date"
          />
        </div>
        <div class="formInput">
          <label for="add-growing-end-date">Growing Season End Date (approximate)</label>
          <input
            type="date"
            id="add-growing-end-date"
            v-model="addGarden.growingSeasonEndDate"
            name="growingSeasonEndDate"
            placeholder="Growing Season End Date"
          />
        </div>
        <div class="formInput">
          <label for="add-size">Garden Size:</label>
          <input type="number" v-model="addGarden.width" placeholder="width" />
          <input type="number" v-model="addGarden.length" placeholder="length" />
          <select v-model="addGarden.measurementType" id="add-measurementType">
            <option
              v-for="measurementType in measurementTypes"
              v-bind:key="measurementType.id"
              v-bind:value="measurementType.id"
            >{{measurementType.name}}</option>
          </select>
        </div>

        <input type="button" value="Add" v-on:click="saveNew(addGarden)" />
        <input type="button" value="Cancel" v-on:click="displayAddForm = false" />
      </form>
    </div>
    <div v-else>
      <input type="button" value="Add Garden" v-on:click="displayAddForm = true" />
    </div>
  </div>
</template>

<script>
import { getAccessToken } from "../../js/auth";
import { MeasurementTypes } from "../../js/enums";
import logging from "../../js/logging";

export default {
  name: "addGardenComponent",
  props: ["uri"],
  data() {
    return {
      displayAddForm: false,
      addGarden: {},
      measurementTypes: MeasurementTypes
    };
  },
  methods: {
    saveNew: function(garden) {
      fetch(this.uri, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(garden)
      })
        .then(response => response.json())
        .then(savedgarden => {
          this.addGarden = {};
          this.displayAddForm = false;
          this.$emit("save-add-return", savedgarden);
        })
        .catch(error => logging.error("Unable to add garden " + error));
    },
  }
};
</script>

<style>
</style>