<template>
  <div id="garden">
    <h2>{{garden == null ? "Garden" : garden.name}}</h2>
        <router-link v-bind:to="'/gardens'">Return to gardens</router-link>
    <hr />

    <!-- Garden Info -->
    <div v-if="garden != null">
      <p>Growing season: {{garden.growingSeasonStartDate}} to {{garden.growingSeasonEndDate}}</p>
      <p>Garden size: {{garden.width}}x{{garden.length}} {{garden.measurementType}}</p>

      <input
        type="button"
        v-if="editGarden == null"
        value="Edit Garden Info"
        v-on:click="displayGardenEditForm(garden)"
      />
      <edit-garden-component
        v-bind:uri="uri"
        v-bind:edit-garden="editGarden"
        v-on:save-edit-return="saveGardenEditReturn"
        v-on:close-edit="editGarden = null"
      ></edit-garden-component>
    </div>

    <hr />
    <!-- Add Form -->
 <add-garden-plant-component
      v-bind:uri="gardenPlantURI"
      v-bind:garden="garden"
      v-on:save-add-garden-plant-return="saveGardenPlantAddReturn"
    ></add-garden-plant-component>

    <!--Edit Form -->
    <edit-garden-plant-component
      v-bind:uri="editGardenPlant != null ? gardenPlantURI + '/' + editGardenPlant.id : ''"
      v-bind:edit-garden-plant="editGardenPlant"
      v-bind:allow-plant-change="true"
      v-on:save-edit-garden-plant-return="saveGardenPlantEditReturn"
      v-on:close-edit="editGardenPlant = null"
    ></edit-garden-plant-component>

    <!-- Display Table -->
    <p class="errorMessage" v-if="errorMessage">{{errorMessage}}</p>
    <p id="counter">{{counterText}}</p>
    <table class="displayContent">
      <tr>
        <th>Name</th>
        <th>Planted</th>
        <th>Estimated Total Yield</th>
        <th>Yield To Date </th>
        <th>Finished Harvesting</th>
        <th></th>
        <th></th>
      </tr>
      <tbody>
        <tr v-for="gardenPlant in gardenPlants" v-bind:key="gardenPlant.id">
          <td>
            <router-link :to="{ name: 'gardenplant', params: { id: gardenPlant.id }}">{{gardenPlant.name}}</router-link>
            <span v-show="gardenPlant.finishedHarvesting">(finished harvesting for the season)</span>
          </td>
          <td>{{gardenPlant.amountPlanted}} {{gardenPlant.amountPlantedType}}</td>
          <td
            v-if="gardenPlant.yieldEstimatedPerAmountPlanted != null"
          >{{gardenPlant.yieldEstimatedPerAmountPlanted * gardenPlant.amountPlanted}} {{gardenPlant.yieldType}}</td>
          <td v-else>-</td>
          <td v-if="gardenPlant.currentYieldAmount">
            {{gardenPlant.currentYieldAmount}} {{gardenPlant.yieldType}}
          </td>
          <td v-else>-</td>
          <td>
            {{gardenPlant.finishedHarvesting ? "✔" : "✘"}}
          </td>
          <td>
            <button v-on:click="displayEditForm(gardenPlant)">Edit</button>
          </td>
          <td>
            <button v-on:click="deleteGardenPlant(gardenPlant.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import logging from "./js/logging";
import { config } from "./js/config";
import { getAccessToken } from "./js/auth";
import { YieldTypes, MeasurementTypes, PlantingTypes } from "./js/enums";
import searchPlantsComponent from "./components/searchPlantsComponent";
import editGardenComponent from "./components/Gardens/editGardenComponent";
import editGardenPlantComponent from "./components/Garden/editGardenPlantComponent";
import addGardenPlantComponent from "./components/Garden/addGardenPlantComponent";

export default {
  components: {
    searchPlantsComponent,
    "edit-garden-component": editGardenComponent,
    "edit-garden-plant-component": editGardenPlantComponent,
    "add-garden-plant-component": addGardenPlantComponent
  },
  name: "garden",
  data() {
    return {
      uri: config.apiURL + "/api/gardens",
      gardenPlantURI: config.apiURL + "/api/gardenplants",
      errorMessage: "",
      gardenPlants: {},
      editGardenPlant: null,
      addGardenPlant: null,
      garden: null,
      yieldTypes: YieldTypes,
      displayAddForm: false,
      editGarden: null,
      plantingTypes: PlantingTypes
    };
  },
  props: ["id"],
  computed: {
    counterText: function() {
      return (
        this.gardenPlants.length +
        (this.gardenPlants.length > 1
          ? " plants in garden"
          : " plant in garden")
      );
    }
  },
  methods: {
    GetContent: function() {
      fetch(this.uri + "/" + this.id, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      })
        .then(response => response.json())
        .then(data => {
          this.gardenPlants = data.gardenPlants;
          this.garden = data;
        })
        .catch(error => logging.error("Unable to get gardens from URL " + this.uri + "/" + this.id + " error was: " + error));
    },
    displayGardenEditForm: function(data) {
      this.editGarden = {};
      this.editGarden.name = data.name;
      this.editGarden.growingSeasonStartDate = data.growingSeasonStartDate;
      this.editGarden.growingSeasonEndDate = data.growingSeasonEndDate;
      this.editGarden.id = data.id;
      this.editGarden.width = data.width;
      this.editGarden.length = data.length;
      this.editGarden.measurementType = data.measurementType;
    },
    displayEditForm: function(data) {
      this.editGardenPlant = {};
      this.editGardenPlant.id = data.id;
      this.editGardenPlant.name = data.name;
      this.editGardenPlant.amountPlanted = data.amountPlanted;
      this.editGardenPlant.yieldEstimatedPerAmountPlanted =
        data.yieldEstimatedPerAmountPlanted;
      this.editGardenPlant.yieldType = data.yieldType;
      this.editGardenPlant.amountPlantedType = data.amountPlantedType;
      this.editGardenPlant.finishedHarvesting = data.finishedHarvesting;
    },
    saveGardenPlantEditReturn: function(savedGardenPlant) {
      let ind = this.gardenPlants.findIndex(x => x.id == savedGardenPlant.id);
      this.gardenPlants[ind] = savedGardenPlant;
      this.editGardenPlant = null;
    },
    saveGardenEditReturn: function(savedgarden) {
      this.garden = savedgarden;
      this.editGarden = null;
    },
    saveGardenPlantAddReturn: function(savedgardenplant){
      this.gardenPlants.push(savedgardenplant);
    },
    deleteGardenPlant: function(id) {
      fetch(`${this.gardenPlantURI}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      })
        .then(response => {
          if (!response.ok) {
            response.json().then(x => {
              this.errorMessage = x.detail;
            });
            throw new Error("error");
          }
        })
        .then(() => {
          let ind = this.gardenPlants.findIndex(x => x.id == id);
          this.gardenPlants.splice(ind, 1);
        })
        .catch(error => {
          logging.log("Unable to delete item." + error);
        });
    }
  },
  created: function() {
    this.GetContent();
  }
};
</script>

<style>
</style>
