<template>
  <div id="editForm" v-if="editPlant != null">
    <h3>Edit</h3>
    <form id="EditForm">
      <input type="hidden" name="ID" v-model="editPlant.id" id="edit-id" />

      <div class="formInput">
        <label for="edit-name">Plant Name:</label>
        <input type="text" id="edit-name" v-model="editPlant.name" name="name" />
      </div>
      <div class="formInput">
        <label for="edit-description">Description:</label>
        <input type="text" id="edit-description" v-model="editPlant.description" name="description" />
      </div>
      <div class="formInput">
        <label for="edit-amount">Amount:</label>
        <input type="number" id="edit-amount" v-model="editPlant.amount" name="amount" />
        <select v-model="editPlant.amountType" id="edit-amounttype">
          <option
            v-for="plantAmountType in plantAmountTypes"
            v-bind:key="plantAmountType.id"
            v-bind:value="plantAmountType.name"
          >{{plantAmountType.name}}</option>
        </select>
      </div>
      <div class="formInput">
        <label for="edit-plantgroup">Plant Group:</label>
        <select v-model="editPlant.plantGroupID" id="edit-plantgroup">
          <option
            v-for="plantGroup in plantGroups"
            v-bind:key="plantGroup.id"
            v-bind:value="plantGroup.id"
          >{{plantGroup.name}}</option>
        </select>
        <add-plant-group-component v-on:save-add-plant-group-return="saveAddPlantGroupReturn"></add-plant-group-component>
      </div>
      <div class="formInput">
        <label for="edit-foodcategory">Food Category:</label>
        <select v-model="editPlant.foodCategoryID" id="edit-foodcategory">
          <option
            v-for="foodCategory in foodCategories"
            v-bind:key="foodCategory.id"
            v-bind:value="foodCategory.id"
          >{{foodCategory.name}}</option>
        </select>
      </div>
      <input type="button" value="Save" v-on:click="saveEdit(editPlant)" />
      <input type="button" value="Cancel" v-on:click="editPlant = null" />
    </form>
  </div>
</template>

<script>
import { config } from "../../js/config";
import { getAccessToken } from "../../js/auth";
import { FoodCategories, PlantAmountTypes } from "../../js/enums";
import addPlantGroupComponent from "./addPlantGroupComponent";

export default {
  name: "editPlantComponent",
  props: ["uri", "editPlant", "plantGroups"],
  components: {
    "add-plant-group-component": addPlantGroupComponent
  },
  data() {
    return {
       plantGroupuri: config.apiURL + "/api/plantgroups",
      foodCategories: FoodCategories,
      plantAmountTypes: PlantAmountTypes
    };
  },
  methods: {
    saveEdit: function(plant) {
      fetch(this.uri + "/" + plant.id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(plant)
      })
        .then(response => response.json())
        .then(savedPlant => {
          this.$emit("save-edit-return", savedPlant);
        })
        .catch(error => console.error("Unable to update item.", error));
    },
    saveAddPlantGroupReturn: function(savedPlantGroup) {
      this.$emit("save-add-plant-group-return", savedPlantGroup);
      this.addPlant.plantGroupId = savedPlantGroup.id;
    }
  }
};
</script>

<style>
</style>