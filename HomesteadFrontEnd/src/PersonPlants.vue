<template>
  <div id="personplants">
    <h2>Your Seed Chest</h2>
    <hr />

    <h3>Add Plant to your seed chest</h3>
    <form id="AddForm">
      <input
        type="text"
        v-model="plantSearchTerm"
        placeholder="Plant Name"
        v-on:keyup="SearchPlants"
      />

      <table
        v-if="plantSearchTerm != '' && searchResultPlants != null && searchResultPlants.length > 0"
      >
        <tr v-for="plant in searchResultPlants" v-bind:key="plant.id">
          <td>{{plant.name}}</td>
          <td>
            <input type="button" value="Select" v-on:click="selectNewPlant(plant)" />
          </td>
        </tr>
      </table>
      <div v-if="addPersonPlant != null">
        <p>{{addPersonPlant.name}}</p>
        <input type="text" placeholder="Amount" v-model="addPersonPlant.amount" />
        <input type="date" placeholder="Buy Date" v-model="addPersonPlant.buyDate" />
      </div>

      <input type="button" value="Add" v-on:click="saveNew(addPersonPlant)" />
    </form>
    <div id="editForm" v-if="editPersonPlant != null">
          <h3>Edit</h3>
          <form id="EditForm">
            <input type="hidden" name="ID" v-model="editPersonPlant.id" id="edit-id" />
            <input type="text" name="name" v-model="editPersonPlant.name" id="edit-name" />
            <input type="text" name="amount" v-model="editPersonPlant.amount" id="edit-amount" />
            <input type="date" name="buydate" v-model="editPersonPlant.buyDate" id="edit-buydate" />
            <input type="button" value="Save" v-on:click="saveEdit(editPersonPlant)" />
            <a v-on:click="editPersonPlant = null" aria-label="Close">&#10006;</a>
          </form>
        </div>
    
    <!-- Display Table -->
    <p class="errorMessage" v-if="errorMessage">{{errorMessage}}</p>
    <p id="counter">{{counterText}}</p>
    <table class="displayContent">
      <tr>
        <th>Name</th>
        <th>Amount</th>
        <th>Buy Date </th>
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
import {config} from './js/config';
import { getAccessToken } from './js/auth';
export default {
  name: "personPlants",
  data() {
    return {
      uri: config.apiURL +"/api/persons",
      personPlantURI: config.apiURL +"/api/personplants",
      allPlantURI: config.apiURL +"/api/plants",
      errorMessage: "",
      personPlants: {},
      allPlants: {},
      plantSearchTerm: "",
      searchResultPlants: [],
      editPersonPlant: null,
      addPersonPlant: null,
      person : null
    };
  },
  props: ["id"],
  computed: {
    counterText: function() {
      return (
        this.personPlants.length +
        (this.personPlants.length > 1
          ? " plants in your seedbox"
          : " plant in your seedbox")
      );
    }
  },
  methods: {
    GetContent: function() {
      fetch(this.uri + "/" + this.id,{
         headers:{
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
      this.GetPlants();
    },
    GetPlants: function() {
      fetch(this.allPlantURI, {
         headers:{
          Authorization: `Bearer ${getAccessToken()}`
        }
      })
        .then(response => response.json())
        .then(data => {
          this.allPlants = data;
        })
        .catch(error => console.error("Unable to get gardens.", error));
    },
    SearchPlants: function() {
      this.errorMessage = "";
      if (this.plantSearchTerm != null && this.plantSearchTerm.length > 0) {
        console.log("search plants func")
        this.searchResultPlants = this.allPlants
          .filter(plant => {
            return plant.name
              .toUpperCase()
              .includes(this.plantSearchTerm.toUpperCase());
          })
          .slice(0, 5);
          if (this.searchResultPlants.length == 0){
            this.errorMessage = "That plant does not exist in our system"
          }
          
      } else {
        this.searchResultPlants = [];
      }
    },
    selectNewPlant: function(plant) {
      console.log("select new plant func")
      this.addPersonPlant = {};
      this.addPersonPlant.plantID = plant.id;
      this.addPersonPlant.name = plant.name;
      this.addPersonPlant.personID = this.id;
    },
    displayEditForm: function(data) {
      console.log("display edit form func")
      this.editPersonPlant = {};
      this.editPersonPlant.name = data.name;
      this.editPersonPlant.amount = data.amount;
      this.editPersonPlant.amountType = data.amountType;
      this.editPersonPlant.buyDate = data.buyDate;
      this.editPersonPlant.id = data.id;
    },
    saveEdit: function(personPlant) {
      fetch(this.personPlantURI + "/" + personPlant.id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(personPlant)
      })
        .then(response => response.json())
        .then(savedpersonPlant => {
          let ind = this.personPlants.findIndex(
            x => x.id == savedpersonPlant.id
          );
          this.personPlants[ind] = savedpersonPlant;
          this.editPersonPlant = null;
        })
        .catch(error => console.error("Unable to update item.", error));
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
            this.plantSearchTerm = "";
          })
          .catch(error => console.error("Unable to add item.", error));
      }
    },
    deletePersonPlant: function(id) {
      fetch(`${this.personPlantURI}/${id}`, {
        method: "DELETE",
        headers:{
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
