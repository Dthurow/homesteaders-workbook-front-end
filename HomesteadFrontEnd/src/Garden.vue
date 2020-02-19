<template>
  <div id="garden">
    <h2>{{garden.name}}</h2>
    <hr />

    <!-- Garden Info -->
    <p> Growing season: {{garden.growingSeasonStartDate}} to {{garden.growingSeasonEndDate}} </p>
    <p> Garden size: {{garden.width}}x{{garden.length}} {{garden.measurementType}} </p>

    <hr />
    <!-- Add Form -->
    <h3>Add Plant to {{garden.name}}</h3>
    <form id="AddForm">
      <input
        type="text"
        v-model="plantSearchTerm"
        placeholder="Plant Name"
        v-on:keyup="SearchPlants"
      />

      <table
        v-if="plantSearchTerm != '' && searchResultPlants != null && searchResultPlants.length > 0"
      >
        <tr v-for="plant in searchResultPlants" v-bind:key="plant.id">
          <td>{{plant.name}}</td>
          <td>
            <input type="button" value="Select" v-on:click="selectNewPlant(plant)" />
          </td>
        </tr>
      </table>
      <div v-if="addGardenPlant != null">
        <p>{{addGardenPlant.name}}</p>
        <input type="text" placeholder="Plant Count" v-model="addGardenPlant.count" />
        <input type="text" placeholder="Estimated Yield" v-model="addGardenPlant.yieldEstimated" />
      </div>

      <input type="button" value="Add" v-on:click="saveNew(addGardenPlant)" />
    </form>

    <!--Edit Form -->
    <div id="editForm" v-if="editGardenPlant != null">
      <h3>Edit {{editGardenPlant.name}}</h3>
      <form id="EditForm">
        <input type="hidden" name="ID" v-model="editGardenPlant.id" id="edit-id" />
        <input type="text" name="name" v-model="editGardenPlant.name" id="edit-name" />
        <input type="text" name="count" v-model="editGardenPlant.count" />
        <input type="text" name="estimatedyield" v-model="editGardenPlant.yieldEstimated" />
        <input type="button" value="Save" v-on:click="saveEdit(editGardenPlant)" />
        <a v-on:click="editGardenPlant = null" aria-label="Close">&#10006;</a>
      </form>
    </div>

    <!-- Display Table -->
    <p class="errorMessage" v-if="errorMessage">{{errorMessage}}</p>
    <p id="counter">{{counterText}}</p>
    <table class="displayContent">
      <tr>
        <th>Name</th>
        <th>Plant Count</th>
        <th>Estimated Yield</th>
        <th>Actual Yield </th>
        <th></th>
        <th></th>
      </tr>
      <tbody>
        <tr v-for="gardenPlant in gardenPlants" v-bind:key="gardenPlant.id">
          <td>{{gardenPlant.name}}</td>
          <td>{{gardenPlant.count}}</td>
          <td>{{gardenPlant.yieldEstimated}} {{gardenPlant.plant.yieldType}}</td>
          <td v-if="gardenPlant.yieldActual != null">{{gardenPlant.yieldActual}} {{gardenPlant.plant.yieldType}}</td>
          <td v-else> - </td>
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
import {config} from './js/config';
import { getAccessToken } from './js/auth';
export default {
  name: "garden",
  data() {
    return {
      uri: config.apiURL +"/api/gardens",
      gardenPlantURI: config.apiURL +"/api/gardenplants",
      allPlantURI: config.apiURL +"/api/plants",
      errorMessage: "",
      gardenPlants: {},
      allPlants: {},
      plantSearchTerm: "",
      searchResultPlants: [],
      editGardenPlant: null,
      addGardenPlant: null,
      garden : null
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
      fetch(this.uri + "/" + this.id,{
         headers:{
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
      this.GetPlants();
    },
    GetPlants: function() {
      fetch(this.allPlantURI, {
         headers:{
          Authorization: `Bearer ${getAccessToken()}`
        }
      })
        .then(response => response.json())
        .then(data => {
          this.allPlants = data;
        })
        .catch(error => console.error("Unable to get gardens.", error));
    },
    SearchPlants: function() {
      this.errorMessage = "";
      if (this.plantSearchTerm != null && this.plantSearchTerm.length > 0) {
        this.searchResultPlants = this.allPlants
          .filter(plant => {
            return plant.name
              .toUpperCase()
              .includes(this.plantSearchTerm.toUpperCase());
          })
          .slice(0, 5);
          if (this.searchResultPlants.length == 0){
            this.errorMessage = "That plant does not exist in our system"
          }
          
      } else {
        this.searchResultPlants = [];
      }
    },
    selectNewPlant: function(plant) {
      this.addGardenPlant = {};
      this.addGardenPlant.plantID = plant.id;
      this.addGardenPlant.name = plant.name;
      this.addGardenPlant.gardenId = this.id;
    },
    displayEditForm: function(data) {
      this.editGardenPlant = {};
      this.editGardenPlant.name = data.name;
      this.editGardenPlant.count = data.count;
      this.editGardenPlant.yieldEstimated = data.yieldEstimated;
      this.editGardenPlant.id = data.id;
    },
    saveEdit: function(gardenPlant) {
      fetch(this.gardenPlantURI + "/" + gardenPlant.id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(gardenPlant)
      })
        .then(response => response.json())
        .then(savedGardenPlant => {
          let ind = this.gardenPlants.findIndex(
            x => x.id == savedGardenPlant.id
          );
          this.gardenPlants[ind] = savedGardenPlant;
          this.editGardenPlant = null;
        })
        .catch(error => console.error("Unable to update item.", error));
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
            this.gardenPlants.push(savedGardenPlant);
            this.addGardenPlant = null;
            this.plantSearchTerm = "";
          })
          .catch(error => console.error("Unable to add item.", error));
      }
    },
    deleteGardenPlant: function(id) {
      fetch(`${this.gardenPlantURI}/${id}`, {
        method: "DELETE",
        headers:{
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
