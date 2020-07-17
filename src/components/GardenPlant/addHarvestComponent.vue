<template>
  <div>
    <div v-if="displayAddForm">
      <h3>Add</h3>
      <form id="AddForm">
        <div class="formInput">
          <label for="add-harvest-amount">Amount Harvested</label>
          <input
            type="number"
            id="add-harvest-amount"
            v-model="addGardenPlantHarvest.amountHarvested"
            name="Amount harvested"
            placeholder="Amount harvested"
          />
          {{gardenPlant.yieldType}}
        </div>
        <div class="formInput">
          <label for="add-harvest-date">Harvest Date</label>
          <input
            type="date"
            id="add-harvest-date"
            v-bind:value="addGardenPlantHarvest.harvestDate && (new Date(addGardenPlantHarvest.harvestDate)).toISOString().split('T')[0]"
            v-on:input="addGardenPlantHarvest.harvestDate = $event.target.value"
            name="harvestDate"
          />
        </div>
        <input type="button" value="Add" v-on:click="saveNew(addGardenPlantHarvest)" />
        <input type="button" value="Cancel" v-on:click="displayAddForm = false" />
      </form>
    </div>
    <div v-else>
      <input type="button" value="Add a new Harvest" v-on:click="displayAddForm = true" />
    </div>
  </div>
</template>
<script>
import { getAccessToken } from "../../js/auth";
import { YieldTypes, PlantingTypes } from "../../js/enums";
import logging from "../../js/logging";

export default {
  name: "addHarvestComponent",
  props: ["uri", "gardenPlant"],
  data() {
    return {
      yieldTypes: YieldTypes,
      plantingTypes: PlantingTypes,
      displayAddForm: false,
      addGardenPlantHarvest: {}
    };
  },
  methods: {
    saveNew: function(gardenPlantHarvest) {
      if (gardenPlantHarvest != null) {
        gardenPlantHarvest.gardenPlantID = this.gardenPlant.id;
        fetch(this.uri, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`
          },
          body: JSON.stringify(gardenPlantHarvest)
        })
          .then(response => response.json())
          .then(savedPlantHarvest => {
            this.$emit("save-add-harvest-return", savedPlantHarvest);
            this.addGardenPlantHarvest = {};
            this.displayAddForm = false;
          })
          .catch(error => logging.error("Unable to add item. " + error));
      }
    }
  }
};
</script>