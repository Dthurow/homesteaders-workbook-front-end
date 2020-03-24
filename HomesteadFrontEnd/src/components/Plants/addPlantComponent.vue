<template>
  <div id="addPlantComponent">
    <form id="AddForm" v-if="displayAddForm">
      <h3>Add</h3>
      <input
        type="text"
        id="add-name"
        v-model="addPlant.name"
        name="name"
        placeholder="New Plant name"
      />
      <input
        type="text"
        id="add-description"
        v-model="addPlant.description"
        name="description"
        placeholder="New Description"
      />
      <select v-model="addPlant.plantGroupId" >
        <option
          v-for="plantGroup in plantGroups"
          v-bind:key="plantGroup.id"
          v-bind:value="plantGroup.id"
        >{{plantGroup.name}}</option>
      </select>

      <select v-model="addPlant.foodCategoryId">
        <option
          v-for="foodCategory in foodCategories"
          v-bind:key="foodCategory.id"
          v-bind:value="foodCategory.id"
        >{{foodCategory.name}}</option>
      </select>

      <input type="button" value="Add" v-on:click="saveNew(addPlant)" />
      <input type="button" value="Cancel" v-on:click="displayAddForm = false" />
    </form>
    <div v-else>
      <input type="button" value="Add Plant" v-on:click="displayAddForm = true" />
    </div>
  </div>
</template>

<script>
import { getAccessToken } from "../../js/auth";
import { FoodCategories } from "../../js/enums";
export default {
  name: "addPlantComponent",
  props: ["uri"],
  data() {
    return {
      displayAddForm: false,
      addPlant: {},
      plantGroups: null,
      foodCategories: FoodCategories
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
        .catch(error => console.error("Unable to add item.", error));
    }
  },
  created: function() {
    fetch(this.uri + "/plantgroups", {
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
  }
};
</script>

<style>
select {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>