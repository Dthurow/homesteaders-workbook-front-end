<template>
  <div id="plantgroupss">
    <h2>Plant Groups</h2>
    <p>Your way of organizing your plants. You can group them by varieties, heirloom, type, cultivars, and more!</p>
    <hr />
    <add-plant-group-component
      v-bind:uri="uri"
      v-bind:plant-groups="plantGroups"
      v-on:save-add-return="saveAddReturn"
      v-on:save-add-plant-group-return="saveAddPlantGroupReturn"
    ></add-plant-group-component>

    <edit-plant-group-component
      v-bind:uri="uri"
      v-bind:edit-plant-group="editPlantGroup"
      v-on:save-edit-plant-group-return="saveEditReturn"
      v-on:close-edit="editPlantGroup = null"
    ></edit-plant-group-component>

    <p class="errorMessage" v-if="errorMessage">{{errorMessage}}</p>
    <p id="counter">{{counterText}}</p>
    <table class="displayContent">
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th></th>
        <th></th>
      </tr>
      <tbody>
        <tr v-for="plantGroup in plantGroups" v-bind:key="plantGroup.id">
          <td>{{plantGroup.name}}</td>
          <td>{{plantGroup.description}}</td>
          <td>
            <button v-on:click="displayEditForm(plantGroup)">Edit</button>
          </td>
          <td>
            <button v-on:click="deletePlantGroup(plantGroup.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { config } from "./js/config";
import { getAccessToken } from "./js/auth";
import addPlantGroupComponent from "./components/PlantGroups/addPlantGroupComponent";
import editPlantGroupComponent from "./components/PlantGroups/editPlantGroupComponent";

export default {
  name: "plantGroups",
  data() {
    return {
      uri: config.apiURL + "/api/plantgroups",
      editPlantGroup: null,
      errorMessage: "",
      plantGroups: {}
    };
  },
  components: {
    "add-plant-group-component": addPlantGroupComponent,
    "edit-plant-group-component": editPlantGroupComponent
  },
  computed: {
    counterText: function() {
      return (
        this.plantGroups.length +
        (this.plantGroups.length > 1 ? " plant groups" : " plant group")
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
          this.plantGroups = data;
        })
        .catch(error => console.error("Unable to get plant groups.", error));
    },
    displayEditForm: function(data) {
      this.errorMessage = "";
      this.editPlantGroup = {};
      for (var key in data) {
        this.editPlantGroup[key] = data[key];
      }
    },
    saveEditReturn: function(savedPlantGroup) {
      console.log("plant group is:");
      console.log(savedPlantGroup);
      let ind = this.plantGroups.findIndex(x => x.id == savedPlantGroup.id);
      this.plantGroups[ind] = savedPlantGroup;
      this.editPlantGroup = null;
    },
    saveAddReturn: function(savedplantGroup) {
      this.plants.push(savedplantGroup);
    },
    saveAddPlantGroupReturn: function(savedPlantGroup) {
      this.plantGroups.push(savedPlantGroup);
    },
    deletePlantGroup: function(id) {
      this.errorMessage = "";
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
          let ind = this.plantGroups.findIndex(x => x.id == id);
          this.plantGroups.splice(ind, 1);
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
