<template>
  <div>
      <h2>Intro to the Homesteader's Workbook</h2>
    <p>
      This page will help you enter the info needed to start tracking your garden, as well as give a little bit of overview
      on how the homesteader's workbook is set up. Let's get started!
    </p>

    <h2>The plants</h2>
    <p>
      Since the main goal of this project is to track plants, it makes sense they take center stage!
      Plants start their life in your
      <router-link v-bind:to="'/seedchest'">seed chest</router-link>.
      The seed chest assumes the plants are either packets of seeds, or seedlings that you haven't gotten
      around to planting in your gardens yet.
    </p>
    <p>
      You add a plant to your seed chest by inputting info about it: The variety name, how much of it you have
      (e.g. how big of a packet of seeds), extra descriptions, and two things that are unique to the homesteader's
      workbook: Food Category and Plant Group 
    </p>
    <h3>Plant Group</h3>
    <p>
      Plant groups allow you to organize your plants. You can group them by varieties, heirloom, type, cultivars,
      or whatever makes the most sense to you. For example, say you have 3 different varieties of tomatoes you
      want to plant: Cherry, Beefsteak, and Pear tomatoes. Before you create the plant, you have to create the group,
      you want to group them by "Tomato". Try adding a plant group below!
    </p>
    <add-plant-group-component
      v-bind:uri="plantgroupURI"
      v-bind:plant-groups="plantGroups"
      v-on:save-add-plant-group-return="saveAddPlantGroupReturn"
    ></add-plant-group-component>

    <div v-if="plantGroups.length > 0">
        <p>Congrats on adding your first Plant Group!</p>
        <p>
            Now that you've added your first Plant Group, you can add your first plant! But first, an explanation of
            Food Category.
        </p>
    </div>

  </div>
</template>


<script>
import { config } from "./js/config";
import addPlantGroupComponent from "./components/PlantGroups/addPlantGroupComponent";

export default {
  name: "intro",
  data() {
    return {
      plantgroupURI: config.apiURL + "/api/plantgroups",
      plantGroups: []
    };
  },
   components: {
    "add-plant-group-component": addPlantGroupComponent
  },
  methods: {
    saveAddPlantGroupReturn: function(savedPlantGroup) {
        console.log("HELLO");
        console.log(savedPlantGroup);
      this.plantGroups.push(savedPlantGroup);
    }
  }
};
</script>

<style>
</style>