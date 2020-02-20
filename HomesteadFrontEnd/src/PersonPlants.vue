<template>
  <div id="personplants">
    <h2>Your Seed Chest</h2>
    <hr />

    <h3>Add Plant to your seed chest</h3>
    <form id="AddForm">
      <searchPlantsComponent v-on:select-new-plant="selectNewPlant"></searchPlantsComponent>

      <div v-if="addPersonPlant != null">
        <p>{{addPersonPlant.name}}</p>
        <input type="text" placeholder="Amount" v-model="addPersonPlant.amount" />
        <input type="date" placeholder="Buy Date" v-model="addPersonPlant.buyDate" />
      </div>

      <input type="button" value="Add" v-on:click="saveNew(addPersonPlant)" />
    </form>

    <editComponent
      v-bind:save-edit-url="editPersonPlant != null ? personPlantURI + '/' + editPersonPlant.id : ''"
      v-bind:edit-item="editPersonPlant"
      v-on:save-edit-return="saveEditReturn"
      v-on:close-edit="editPersonPlant = null"
    ></editComponent>

    <!-- Display Table -->
    <p class="errorMessage" v-if="errorMessage">{{errorMessage}}</p>
    <p id="counter">{{counterText}}</p>
    <table class="displayContent">
      <tr>
        <th>Name</th>
        <th>Amount</th>
        <th>Buy Date</th>
        <th></th>
        <th></th>
      </tr>
      <tbody>
        <tr v-for="personPlant in personPlants" v-bind:key="personPlant.id">
          <td>{{personPlant.name}}</td>
          <td>{{personPlant.amount}} {{personPlant.amountType}}</td>
          <td>{{personPlant.buyDate}}</td>
          <td>
            <button v-on:click="displayEditForm(personPlant)">Edit</button>
          </td>
          <td>
            <button v-on:click="deletePersonPlant(personPlant.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { config } from "./js/config";
import { getAccessToken } from "./js/auth";
import editComponent from "./components/editComponent";
import searchPlantsComponent from "./components/searchPlantsComponent";

export default {
  name: "personPlants",
  components: {
    editComponent,
    searchPlantsComponent
  },
  data() {
    return {
      uri: config.apiURL + "/api/persons",
      personPlantURI: config.apiURL + "/api/personplants",
      allPlantURI: config.apiURL + "/api/plants",
      errorMessage: "",
      personPlants: {},
      editPersonPlant: null,
      addPersonPlant: null,
      person: null
    };
  },
  props: ["id"],
  computed: {
    counterText: function() {
      return (
        this.personPlants.length +
        (this.personPlants.length > 1
          ? " plants in your seed chest"
          : " plant in your seed chest")
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
          this.personPlants = data.personPlants;
          this.person = data;
        })
        .catch(error => console.error("Unable to get person.", error));
    },
    selectNewPlant: function(plant) {
      console.log("select new plant func");
      this.addPersonPlant = {};
      this.addPersonPlant.plantID = plant.id;
      this.addPersonPlant.name = plant.name;
      this.addPersonPlant.personID = this.id;
    },
    displayEditForm: function(data) {
      this.editPersonPlant = {};
      this.editPersonPlant.id = data.id;
      this.editPersonPlant.values = [];

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
            case "amountType": {
              kvp["name"] = "amount type";
              kvp["type"] = "select";
              kvp["selectOptions"] = ["ounces", "seedlings"];
              break;
            }
            case "buyDate": {
              kvp["name"] = "buy date";
              kvp["type"] = "date";
              break;
            }
          }
          this.editPersonPlant.values.push(kvp);
        }
      }
    },
    saveEditReturn: function(savedpersonPlant) {
      let ind = this.personPlants.findIndex(x => x.id == savedpersonPlant.id);
      this.personPlants[ind] = savedpersonPlant;
      this.editPersonPlant = null;
    },
    saveNew: function(personPlant) {
      if (personPlant != null) {
        fetch(this.personPlantURI, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`
          },
          body: JSON.stringify(personPlant)
        })
          .then(response => response.json())
          .then(savedpersonPlant => {
            this.personPlants.push(savedpersonPlant);
            this.addPersonPlant = null;
          })
          .catch(error => console.error("Unable to add item.", error));
      }
    },
    deletePersonPlant: function(id) {
      fetch(`${this.personPlantURI}/${id}`, {
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
          let ind = this.personPlants.findIndex(x => x.id == id);
          this.personPlants.splice(ind, 1);
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
