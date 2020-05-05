<template>
  <div v-if="editGardenPlant != null">
    <h3>Edit</h3>
    <form id="EditForm">
      <searchPlantsComponent v-if="allowPlantChange" v-on:select-new-plant="selectNewPlant"></searchPlantsComponent>

      <div v-if="editGardenPlant != null">
        <p>{{editGardenPlant.name}}</p>
        <div class="formInput">
          <label for="add-count">Plant Count:</label>
          <input type="number" id="add-count" v-model="editGardenPlant.amountPlanted" />
          <select v-model="editGardenPlant.amountPlantedType" id="add-plantedtype">
            <option
              v-for="plantingType in plantingTypes"
              v-bind:key="plantingType.id"
              v-bind:value="plantingType.name"
            >{{plantingType.name}}</option>
          </select>
        </div>
        <div class="formInput">
          <label
            for="add-yield"
          >Yield Estimated{{editGardenPlant.amountPlantedType ? " per " + editGardenPlant.amountPlantedType : ""}}:</label>
          <input
            type="number"
            id="add-yield"
            v-model="editGardenPlant.yieldEstimatedPerAmountPlanted"
          />
          <select v-model="editGardenPlant.yieldType" id="add-yieldtype">
            <option
              v-for="yieldType in yieldTypes"
              v-bind:key="yieldType.id"
              v-bind:value="yieldType.name"
            >{{yieldType.name}}</option>
          </select>
        </div>
        <div class="formInput">
          <label for="edit-finished-harvest">Finished Harvesting?</label>
          <input type="checkbox" v-model="editGardenPlant.finishedHarvesting" />
        </div>
      </div>
      <input type="button" value="Save" v-on:click="saveEdit(editGardenPlant)" />
      <input type="button" value="Cancel" v-on:click="$emit('close-edit')" />
    </form>
  </div>
</template>

<script>
import { getAccessToken } from "../../js/auth";
import { YieldTypes, PlantingTypes } from "../../js/enums";
import searchPlantsComponent from "../searchPlantsComponent";
import logging from "../../js/logging";

export default {
  name: "editGardenPlantComponent",
  props: ["uri", "editGardenPlant", "allowPlantChange"],
  data() {
    return {
      yieldTypes: YieldTypes,
      plantingTypes: PlantingTypes
    };
  },
  components: {
    searchPlantsComponent
  },
  methods: {
    saveEdit: function(plant) {
      fetch(this.uri, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(plant)
      })
        .then(response => response.json())
        .then(savedGardenPlant => {
          this.$emit("save-edit-garden-plant-return", savedGardenPlant);
        })
        .catch(error => logging.error("Unable to add garden plant. " + error));
    },
    selectNewPlant: function(plant) {
      this.editGardenPlant.plantID = plant.id;
      this.editGardenPlant.name = plant.name;
    }
  }
};
</script>

<style>
</style>