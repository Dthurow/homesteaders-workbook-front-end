<template>
  <div id="garden">
    <h2>{{garden == null ? "Garden" : garden.name}}</h2>
    <hr />

    <!-- Garden Info -->
    <div v-if="garden != null">
      <p>Growing season: {{garden.growingSeasonStartDate}} to {{garden.growingSeasonEndDate}}</p>
      <p>Garden size: {{garden.width}}x{{garden.length}} {{garden.measurementType}}</p>

      <input type="button" v-if="editGarden == null" value="Edit Garden Info" v-on:click="displayGardenEditForm(garden)" />
      <edit-garden-component
        v-bind:uri="uri"
        v-bind:edit-garden="editGarden"
        v-on:save-edit-return="saveGardenEditReturn"
        v-on:close-edit="editGarden = null"
      ></edit-garden-component>
    </div>

    <hr />
    <!-- Add Form -->
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
            <label for="add-yield">Yield Estimated:</label>
            <input type="number" id="add-yield" v-model="addGardenPlant.yieldEstimatedPerAmountPlanted" />
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

    <!--Edit Form -->
    <edit-garden-plant-component
    v-bind:uri="editGardenPlant != null ? gardenPlantURI + '/' + editGardenPlant.id : ''"
      v-bind:edit-garden-plant="editGardenPlant"
      v-on:save-edit-garden-plant-return="saveEditReturn"
      v-on:close-edit="editGardenPlant = null"
    >
    </edit-garden-plant-component>


    <!-- Display Table -->
    <p class="errorMessage" v-if="errorMessage">{{errorMessage}}</p>
    <p id="counter">{{counterText}}</p>
    <table class="displayContent">
      <tr>
        <th>Name</th>
        <th>Planted</th>
        <th>Estimated Yield</th>
        <th></th>
        <th></th>
      </tr>
      <tbody>
        <tr v-for="gardenPlant in gardenPlants" v-bind:key="gardenPlant.id">
          <td>{{gardenPlant.name}}</td>
          <td>{{gardenPlant.amountPlanted}} {{gardenPlant.amountPlantedType}}</td>
          <td
            v-if="gardenPlant.yieldEstimatedPerAmountPlanted != null"
          >{{gardenPlant.yieldEstimatedPerAmountPlanted}} {{gardenPlant.yieldType}}</td>
          <td v-else>-</td>
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
import { config } from "./js/config";
import { getAccessToken } from "./js/auth";
import { YieldTypes, MeasurementTypes, PlantingTypes } from "./js/enums";
import searchPlantsComponent from "./components/searchPlantsComponent";
import editComponent from "./components/editComponent";
import editGardenComponent from "./components/Gardens/editGardenComponent";
import editGardenPlantComponent from "./components/Garden/editGardenPlantComponent";

export default {
  components: {
    searchPlantsComponent,
    editComponent,
    "edit-garden-component": editGardenComponent,
    "edit-garden-plant-component": editGardenPlantComponent
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
          console.log(data);
          this.gardenPlants = data.gardenPlants;
          this.garden = data;
        })
        .catch(error => console.error("Unable to get gardens.", error));
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
    selectNewPlant: function(plant) {
      this.addGardenPlant = {};
      this.addGardenPlant.plantID = plant.id;
      this.addGardenPlant.name = plant.name;
      this.addGardenPlant.gardenId = this.id;
      this.addGardenPlant.plant = plant;
    },
    displayEditForm: function(data) {
      this.editGardenPlant = {};
      this.editGardenPlant.id = data.id;
      this.editGardenPlant.name = data.name;
      this.editGardenPlant.amountPlanted = data.amountPlanted;
      this.editGardenPlant.yieldEstimatedPerAmountPlanted = data.yieldEstimatedPerAmountPlanted;
      this.editGardenPlant.yieldType = data.yieldType;
      
    },
    saveEditReturn: function(savedGardenPlant) {
      let ind = this.gardenPlants.findIndex(x => x.id == savedGardenPlant.id);
      this.gardenPlants[ind] = savedGardenPlant;
      this.editGardenPlant = null;
    },
    saveGardenEditReturn: function(savedgarden) {
      this.garden = savedgarden;
      this.editGarden = null;
    },
    saveNew: function(gardenPlant) {
      if (gardenPlant != null) {
        fetch(this.gardenPlantURI, {
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
            this.gardenPlants.push(gardenPlant);
            this.addGardenPlant = null;
            this.plantSearchTerm = "";
            this.displayAddForm = false;
          })
          .catch(error => console.error("Unable to add item.", error));
      }
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
          console.log("Unable to delete item.", error);
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
