<template>
  <div id="addPlantComponent">
    <form id="AddForm" v-if="displayAddForm">
      <h3>Add</h3>
      <div v-if="plantGroups == null || plantGroups.length == 0" class="specialAlert">
        <b>NOTE</b> You need to create a Plant Group before creating a new plant. 
         <router-link to="/plantgroups">Create a new plant group</router-link>
      </div>
      <div class="formInput">
        <label for="add-name">New Plant Name:</label>
        <input type="text" id="add-name" v-model="addPlant.name" name="name" />
      </div>
      <div class="formInput">
        <label for="add-description">New Description:</label>
        <input type="text" id="add-description" v-model="addPlant.description" name="description" />
      </div>
      <div class="formInput">
        <label for="add-amount">Amount:</label>
        <input type="number" id="add-amount" v-model="addPlant.amount" name="amount" />
        <select v-model="addPlant.amountType" id="add-amounttype">
          <option
            v-for="plantAmountType in plantAmountTypes"
            v-bind:key="plantAmountType.id"
            v-bind:value="plantAmountType.id"
          >{{plantAmountType.name}}</option>
        </select>
      </div>
      <div class="formInput">
        <label for="add-plantgroup">Plant Group:</label>
        <select v-model="addPlant.plantGroupId" id="add-plantgroup">
          <option
            v-for="plantGroup in plantGroups"
            v-bind:key="plantGroup.id"
            v-bind:value="plantGroup.id"
          >{{plantGroup.name}}</option>
        </select>

        <router-link to="/plantgroups">Manage your plant groups</router-link>
       
      </div>
      <div class="formInput">
        <label for="add-foodcategory">Food Category:</label>
        <select v-model="addPlant.foodCategoryId" id="add-foodcategory">
          <option
            v-for="foodCategory in foodCategories"
            v-bind:key="foodCategory.id"
            v-bind:value="foodCategory.id"
          >{{foodCategory.name}}</option>
        </select>
      </div>
      <input type="button" value="Add" v-on:click="saveNew(addPlant)" />
      <input type="button" value="Cancel" v-on:click="displayAddForm = false" />
    </form>
    <div v-else>
      <input type="button" value="Add Plant" v-on:click="displayAddForm = true" />
    </div>
  </div>
</template>

<script>
import { config } from "../../js/config";
import { getAccessToken } from "../../js/auth";
import { FoodCategories, PlantAmountTypes } from "../../js/enums";
import logging from "../../js/logging";

export default {
  name: "addPlantComponent",
  props: ["uri", "plantGroups"],
  data() {
    return {
      displayAddForm: false,
      plantGroupuri: config.apiURL + "/api/plantgroups",
      addPlant: {},
      foodCategories: FoodCategories,
      plantAmountTypes: PlantAmountTypes
    };
  },
  methods: {
    saveNew: function(plant) {
      fetch(this.uri, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(plant)
      })
        .then(response => response.json())
        .then(savedplant => {
          this.$emit("save-add-return", savedplant);
          this.addPlant = {};
          this.displayAddForm = false;
        })
        .catch(error => logging.error("Unable to add plant." + error));
    }
  }
};
</script>

<style>
select {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>