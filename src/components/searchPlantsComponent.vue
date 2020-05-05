<template>
  <div>
    <p class="errorMessage" v-if="errorMessage">{{errorMessage}}</p>
    <input type="text" v-model="plantSearchTerm" placeholder="Plant Name" v-on:keyup="SearchPlants" />

    <table
      v-if="plantSearchTerm != '' && searchResultPlants != null && searchResultPlants.length > 0"
    >
      <tr v-for="plant in searchResultPlants" v-bind:key="plant.id">
        <td>{{plant.name}}</td>
        <td>
          <input type="button" value="Select" v-on:click="SelectPlant(plant)" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { config } from "../js/config";
import { getAccessToken } from "../js/auth";
import logging from "../js/logging";

export default {
  name: "searchPlants",
  data() {
    return {
      plantSearchTerm: "",
      errorMessage: null,
      allPlants: [],
      allPlantURI: config.apiURL + "/api/plants",
      searchResultPlants:[]
    };
  },
  methods: {
    SearchPlants: function() {
      this.errorMessage = "";
      if (this.plantSearchTerm != null && this.plantSearchTerm.length > 0) {
        console.log("search plants func");
        this.searchResultPlants = this.allPlants
          .filter(plant => {
            return plant.name
              .toUpperCase()
              .includes(this.plantSearchTerm.toUpperCase());
          })
          .slice(0, 5);
        if (this.searchResultPlants.length == 0) {
          this.errorMessage = "That plant does not exist in your seed chest";
        }
      } else {
        this.searchResultPlants = [];
      }
    },
    SelectPlant: function(plant){
        this.plantSearchTerm = "";
        this.$emit('select-new-plant', plant)
    }
  },
  props: [],
  created: function(){
      fetch(this.allPlantURI, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      })
        .then(response => response.json())
        .then(data => {
          this.allPlants = data;
        })
        .catch(error => logging.error("Unable to get all plants." + error));
  }
};
</script>

<style>
</style>