<template>
  <div id="garden">
    <h2>{{garden == null ? "Garden" : garden.name}}</h2>
    <hr />

    <!-- Garden Info -->
    <div v-if="garden != null">
      <p>Growing season: {{garden.growingSeasonStartDate}} to {{garden.growingSeasonEndDate}}</p>
      <p>Garden size: {{garden.width}}x{{garden.length}} {{garden.measurementType}}</p>
    </div>

    <hr />
    <!-- Add Form -->
    <h3>Add Plant to {{garden == null ? "Garden" : garden.name}}</h3>
    <form id="AddForm">
      <searchPlantsComponent v-on:select-new-plant="selectNewPlant"></searchPlantsComponent>

      <div v-if="addGardenPlant != null">
        <p>{{addGardenPlant.name}}</p>
        <input type="text" placeholder="Plant Count" v-model="addGardenPlant.count" />
        <input type="text" placeholder="Estimated Yield" v-model="addGardenPlant.yieldEstimated" />
        <input type="text" disabled v-model="addGardenPlant.plant.yieldType" />
      </div>

      <input type="button" value="Add" v-on:click="saveNew(addGardenPlant)" />
    </form>

    <!--Edit Form -->
    <editComponent
      v-bind:save-edit-url="editGardenPlant != null ? gardenPlantURI + '/' + editGardenPlant.id : ''"
      v-bind:edit-item="editGardenPlant"
      v-on:save-edit-return="saveEditReturn"
      v-on:close-edit="editGardenPlant = null"
    ></editComponent>

    <!-- Display Table -->
    <p class="errorMessage" v-if="errorMessage">{{errorMessage}}</p>
    <p id="counter">{{counterText}}</p>
    <table class="displayContent">
      <tr>
        <th>Name</th>
        <th>Plant Count</th>
        <th>Estimated Yield</th>
        <th>Actual Yield</th>
        <th></th>
        <th></th>
      </tr>
      <tbody>
        <tr v-for="gardenPlant in gardenPlants" v-bind:key="gardenPlant.id">
          <td>{{gardenPlant.name}}</td>
          <td>{{gardenPlant.count}}</td>
          <td>{{gardenPlant.yieldEstimated}} {{gardenPlant.plant.yieldType}}</td>
          <td
            v-if="gardenPlant.yieldActual != null"
          >{{gardenPlant.yieldActual}} {{gardenPlant.plant.yieldType}}</td>
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
import searchPlantsComponent from "./components/searchPlantsComponent";
import editComponent from "./components/editComponent";

export default {
  components: {
    searchPlantsComponent,
    editComponent
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
      garden: null
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
      this.editGardenPlant.values = [];

      for (var key in data) {
        if (
          typeof data[key] != "object" &&
          key != "id" &&
          !key.endsWith("ID")
        ) {
          var kvp = {};
          kvp["name"] = key;
          kvp["propName"] = key;
          kvp["value"] = data[key];
          kvp["type"] = "text";

          switch (key) {
            case "name": {
              kvp["required"] = true;
              break;
            }
          }
          this.editGardenPlant.values.push(kvp);
        }
      }
    },
    saveEditReturn: function(savedGardenPlant) {
      let ind = this.gardenPlants.findIndex(x => x.id == savedGardenPlant.id);
      this.gardenPlants[ind] = savedGardenPlant;
      this.editGardenPlant = null;
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
