<template>
  <div id="plants">
    <h2>Your Seed Chest</h2>
    <p>A collection of plants currently stored in your homesteader's workbook.</p>
    <hr />
    <add-plant-component
      v-bind:uri="uri"
      v-bind:plant-groups="plantGroups"
      v-on:save-add-return="saveAddReturn"
      v-on:save-add-plant-group-return="saveAddPlantGroupReturn"
    ></add-plant-component>

    <edit-plant-component
      v-bind:uri="uri"
      v-bind:plant-groups="plantGroups"
      v-bind:edit-plant="editPlant"
      v-on:save-edit-return="saveEditReturn"
    ></edit-plant-component>

    <p class="errorMessage" v-if="errorMessage">{{errorMessage}}</p>
    <p id="counter">{{counterText}}</p>
    <table class="displayContent">
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Amount</th>
        <th>Plant Group</th>
        <th>Food Category</th>
        <th></th>
        <th></th>
      </tr>
      <tbody>
        <tr v-for="plant in plants" v-bind:key="plant.id">
          <td>{{plant.name}}</td>
          <td>{{plant.description}}</td>
          <td>{{plant.amount}} {{plant.amountType}}</td>
          <td>
            <p v-if="plant.plantGroup !== null">{{plant.plantGroup.name}}</p>
          </td>
          <td>
            <p v-if="plant.foodCategory !== null">{{plant.foodCategory.name}}</p>
          </td>
          <td>
            <button v-on:click="displayEditForm(plant)">Edit</button>
          </td>
          <td>
            <button v-on:click="deletePlant(plant.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { config } from "./js/config";
import { getAccessToken } from "./js/auth";
import addPlantComponent from "./components/Plants/addPlantComponent";
import editPlantComponent from "./components/Plants/editPlantComponent";

export default {
  name: "plants",
  data() {
    return {
      plants: {},
      uri: config.apiURL + "/api/plants",
      editPlant: null,
      errorMessage: "",
      plantGroupuri: config.apiURL + "/api/plantgroups",
      plantGroups: null
    };
  },
  components: {
    "add-plant-component": addPlantComponent,
    "edit-plant-component": editPlantComponent
  },
  computed: {
    counterText: function() {
      return (
        this.plants.length +
        (this.plants.length > 1
          ? " plant varieties in your seed chest"
          : " plant variety in your seed chest")
      );
    }
  },
  methods: {
    GetContent: function() {
      fetch(this.uri, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          this.plants = data;
        })
        .catch(error => console.error("Unable to get plants.", error));

      fetch(this.plantGroupuri, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          this.plantGroups = data;
        })
        .catch(error => console.error("Unable to get plant groups.", error));
    },
    displayEditForm: function(data) {
      this.editPlant = {};
      for (var key in data) {
        this.editPlant[key] = data[key];
      }
    },
    saveEditReturn: function(savedPlant) {
      console.log("plant is:");
      console.log(savedPlant);
      let ind = this.plants.findIndex(x => x.id == savedPlant.id);
      this.plants[ind] = savedPlant;
      this.editPlant = null;
    },
    saveAddReturn: function(savedplant) {
      this.plants.push(savedplant);
    },
    saveAddPlantGroupReturn: function(savedPlantGroup) {
      this.plantGroups.push(savedPlantGroup);
    },
    deletePlant: function(id) {
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
          let ind = this.plants.findIndex(x => x.id == id);
          this.plants.splice(ind, 1);
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
