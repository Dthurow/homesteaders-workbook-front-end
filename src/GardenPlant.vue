<template>
  <div id="gardenplant">
    <h2>{{gardenPlant == null ? "Plant" : gardenPlant.name}}</h2>
    <router-link v-if="gardenPlant" v-bind:to="'/garden/' + gardenPlant.gardenID">Return to garden</router-link>
    <hr />

    <!-- Garden plant Info -->
    <div v-if="gardenPlant != null">
      <p>Amount Planted: {{gardenPlant.amountPlanted}} {{gardenPlant.amountPlantedType}}</p>
      <p>Estimated Yield per  {{gardenPlant.amountPlantedType}}: {{gardenPlant.yieldEstimatedPerAmountPlanted}} {{gardenPlant.yieldType}}</p>
      <p>Estimated Total Yield: {{gardenPlant.yieldEstimatedPerAmountPlanted * gardenPlant.amountPlanted}} {{gardenPlant.yieldType}}</p>
      <p> Finished Harvesting? {{gardenPlant.finishedHarvesting ? "✔" : "✘"}}</p>
      <p v-if="gardenPlant.currentYieldAmount">Yield To Date: {{gardenPlant.currentYieldAmount}} {{gardenPlant.yieldType}}</p>
      

      <button v-on:click="displayGardenPlantEditForm(gardenPlant)">Edit Garden Plant</button>
      <edit-garden-plant-component
        v-bind:uri="editGardenPlant != null ? gardenPlantURI + '/' + editGardenPlant.id : ''"
        v-bind:edit-garden-plant="editGardenPlant"
        v-bind:allow-plant-change="false"
        v-on:save-edit-garden-plant-return="saveGardenPlantEditReturn"
        v-on:close-edit="editGardenPlant = null"
      ></edit-garden-plant-component>
    </div>

    <hr />

    <!-- Add Form -->
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

    <!--Edit Form -->
    <div v-if="editGardenPlantHarvest">
      <h3>Edit</h3>
      <form id="EditForm">
        <input type="hidden" name="ID" v-model="editGardenPlantHarvest.id" id="edit-id" />
        <div class="formInput">
          <label for="edit-name">Amount Harvested:</label>
          <input
            type="text"
            id="edit-name"
            v-model="editGardenPlantHarvest.amountHarvested"
            name="name"
          />
          {{gardenPlant.yieldType}}
        </div>
        <div class="formInput">
          <label for="edit-growing-start-date">Harvest date:</label>
          <input
            type="date"
            id="edit-growing-start-date"
            v-bind:value="editGardenPlantHarvest.harvestDate && (new Date(editGardenPlantHarvest.harvestDate)).toISOString().split('T')[0]"
            v-on:input="editGardenPlantHarvest.harvestDate = $event.target.value"
            name="growingSeasonStartDate"
            placeholder="Growing Season Start Date"
          />
        </div>
        <input type="button" value="Save" v-on:click="saveEdit(editGardenPlantHarvest)" />
        <input type="button" value="Cancel" v-on:click="editGardenPlantHarvest = null" />
      </form>
    </div>

    <!-- Display Table -->
    <p class="errorMessage" v-if="errorMessage">{{errorMessage}}</p>
    <p id="counter">{{counterText}}</p>
    <table class="displayContent">
      <tr>
        <th>Harvest Amount</th>
        <th>Harvest Date</th>
        <th></th>
        <th></th>
      </tr>
      <tbody>
        <tr v-for="gardenPlantHarvest in gardenPlantHarvests" v-bind:key="gardenPlantHarvest.id">
          <td>{{gardenPlantHarvest.amountHarvested}} {{gardenPlant ? gardenPlant.yieldType : ""}}</td>
          <td>{{gardenPlantHarvest.harvestDate}}</td>
          <td>
            <button v-on:click="displayGardenPlantHarvestEditForm(gardenPlantHarvest)">Edit</button>
          </td>
          <td>
            <button v-on:click="deleteGardenPlantHarvest(gardenPlantHarvest.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { config } from "./js/config";
import { getAccessToken } from "./js/auth";
import { YieldTypes } from "./js/enums";
import logging from "./js/logging";
import editGardenPlantComponent from "./components/Garden/editGardenPlantComponent";

export default {
  components: {
    "edit-garden-plant-component": editGardenPlantComponent
  },
  name: "gardenplant",
  data() {
    return {
      uri: config.apiURL + "/api/GardenPlantHarvests",
      gardenPlantURI: config.apiURL + "/api/gardenplants",
      errorMessage: "",
      gardenPlantHarvests: {},
      editGardenPlantHarvest: null,
      addGardenPlantHarvest: {},
      gardenPlant: null,
      displayAddForm: false,
      editGardenPlant: null
    };
  },
  props: ["id"],
  computed: {
    counterText: function() {
      return (
        this.gardenPlantHarvests.length +
        (this.gardenPlantHarvests.length > 1
          ? " harvests so far this growing season"
          : " harvest so far this growing season")
      );
    }
  },
  methods: {
    GetContent: function() {
      //get harvests for this garden plant
      fetch(this.uri + "/gardenplant/" + this.id, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          this.gardenPlantHarvests = data;
        })
        .catch(error =>
          logging.error("Unable to get garden plant harvests. " + error)
        );

      //get garden plant info
      fetch(this.gardenPlantURI + "/" + this.id, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          this.gardenPlant = data;
        })
        .catch(error => logging.error("Unable to get garden plant. " + error));
    },
    displayGardenPlantEditForm: function(data) {
      this.editGardenPlant = {};
      this.editGardenPlant.id = data.id;
      this.editGardenPlant.name = data.name;
      this.editGardenPlant.amountPlanted = data.amountPlanted;
      this.editGardenPlant.yieldEstimatedPerAmountPlanted =
        data.yieldEstimatedPerAmountPlanted;
    },
    displayGardenPlantHarvestEditForm: function(data) {
      this.editGardenPlantHarvest = {};
      this.editGardenPlantHarvest.id = data.id;
      this.editGardenPlantHarvest.amountHarvested = data.amountHarvested;
      this.editGardenPlantHarvest.harvestDate = data.harvestDate;
    },
    saveGardenPlantEditReturn: function(savedgardenPlant) {
      this.gardenPlant = savedgardenPlant;
      this.editGardenPlant = null;
    },
    saveNew: function(gardenPlantHarvest) {
      if (gardenPlantHarvest != null) {
        gardenPlantHarvest.gardenPlantID = this.id;
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
          .then(savedGardenPlant => {
            this.gardenPlantHarvests.push(gardenPlantHarvest);
            this.addGardenPlantHarvest = {};
            this.displayAddForm = false;
          })
          .catch(error => logging.error("Unable to add item. " + error));
      }
    },
    saveEdit: function(plantHarvest) {
      fetch(this.uri + "/" + plantHarvest.id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(plantHarvest)
      })
        .then(response => response.json())
        .then(savedGardenPlantHarvest => {
          let ind = this.gardenPlantHarvests.findIndex(
            x => x.id == savedGardenPlantHarvest.id
          );
          this.gardenPlantHarvests[ind] = savedGardenPlantHarvest;
          this.editGardenPlantHarvest = null;
        })
        .catch(error => logging.error("Unable to add item." + error));
    },
    deleteGardenPlantHarvest: function(id) {
      fetch(`${this.uri}/${id}`, {
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
          let ind = this.gardenPlantHarvests.findIndex(x => x.id == id);
          this.gardenPlantHarvests.splice(ind, 1);
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
