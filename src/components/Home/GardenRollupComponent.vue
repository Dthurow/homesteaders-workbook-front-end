<template>
  <div>
    <h2>Currently Growing</h2>
    <p class="errorMessage" v-if="errorMessage">{{errorMessage}}</p>
    <table class="displayContent">
      <tr>
        <th>Plant</th>
        <th>Amount Planted</th>
        <th>Food Category</th>
        <th>Garden</th>
        <th>Estimated Total Yield</th>
        <th>Yield To Date</th>
      </tr>
      <tbody>
        <tr v-for="plant in currentGardenPlants" v-bind:key="plant.id">
          <td>
            <router-link v-bind:to="'/gardenplant/' + plant.id">{{plant.name}}</router-link>
          </td>
          <td>{{plant.amountPlanted}} {{plant.amountPlantedType}}</td>
          <td>{{plant.plant.foodCategory.name}}</td>
          <td>
            <router-link v-bind:to="'/garden/' + plant.gardenID">{{plant.gardenName}}</router-link>
          </td>
          <td>{{plant.yieldEstimatedPerAmountPlanted * plant.amountPlanted}} {{plant.yieldType}}</td>
          <td>{{plant.currentYieldAmount}} {{plant.yieldType}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { config } from "../../js/config";
import { getAccessToken } from "../../js/auth";
import logging from "../../js/logging";

export default {
  name: "gardenrollup",
  data() {
    return {
      uri: config.apiURL + "/api/gardenplants",
      errorMessage: "",
      gardenPlants: []
    };
  },
  computed: {
    currentGardenPlants: function() {
      return this.gardenPlants.filter(x => {
        return !x.finishedHarvesting;
      });
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
          this.gardenPlants = data;
        })
        .catch(error =>
          logging.error(
            "Unable to get gardens. with URI " + this.uri + " error " + error
          )
        );
    }
  },
  created: function() {
    this.GetContent();
  }
};
</script>

<style>
</style>