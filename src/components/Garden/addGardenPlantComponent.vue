<template>
  <div>
    <div v-if="displayAddForm">
      <h3>Add Plant to {{garden == null ? "Garden" : garden.name}}</h3>
      <form id="AddForm">
        <searchPlantsComponent v-on:select-new-plant="selectNewPlant"></searchPlantsComponent>

        <div v-if="addGardenPlant != null">
          <p>{{addGardenPlant.name}}</p>
          <div class="formInput">
            <label for="add-count">Plant Count:</label>
            <input type="number" id="add-count" v-model="addGardenPlant.amountPlanted" />
            <select v-model="addGardenPlant.amountPlantedType" id="add-plantedtype">
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
            >Yield Estimated{{addGardenPlant.amountPlantedType ? " per " + addGardenPlant.amountPlantedType : ""}}:</label>
            <input
              type="number"
              id="add-yield"
              v-model="addGardenPlant.yieldEstimatedPerAmountPlanted"
            />
            <select v-model="addGardenPlant.yieldType" id="add-yieldtype">
              <option
                v-for="yieldType in yieldTypes"
                v-bind:key="yieldType.id"
                v-bind:value="yieldType.name"
              >{{yieldType.name}}</option>
            </select>
          </div>
        </div>
        <input
          v-if="addGardenPlant != null"
          type="button"
          value="Add"
          v-on:click="saveNew(addGardenPlant)"
        />
        <input type="button" value="Cancel" v-on:click="displayAddForm = false" />
      </form>
    </div>
    <div v-else>
      <input type="button" value="Add Plant to Garden" v-on:click="displayAddForm = true" />
    </div>
  </div>
</template>
<script>
import { getAccessToken } from "../../js/auth";
import { YieldTypes, PlantingTypes } from "../../js/enums";
import searchPlantsComponent from "../searchPlantsComponent";
import logging from "../../js/logging";

export default {
  name: "addGardenPlantComponent",
  props: ["uri", "garden"],
  data() {
    return {
      yieldTypes: YieldTypes,
      plantingTypes: PlantingTypes,
      addGardenPlant: null,
      displayAddForm: false
    };
  },
  components: {
    searchPlantsComponent
  },
  methods: {
    selectNewPlant: function(plant) {
      this.addGardenPlant = {};
      this.addGardenPlant.plantID = plant.id;
      this.addGardenPlant.name = plant.name;
      this.addGardenPlant.gardenId = this.garden.id;
      this.addGardenPlant.plant = plant;
    },
    saveNew: function(gardenPlant) {
      if (gardenPlant != null) {
        fetch(this.uri, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`
          },
          body: JSON.stringify(gardenPlant)
        })
          .then(response => response.json())
          .then(savedGardenPlant => {
            this.$emit("save-add-garden-plant-return", savedGardenPlant);
            this.addGardenPlant = null;
            this.plantSearchTerm = "";
            this.displayAddForm = false;
          })
          .catch(error => logging.error("Unable to add item." + error));
      }
    }
  }
};
</script>