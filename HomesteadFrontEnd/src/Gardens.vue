<template>
  <div id="gardens">
    <h2>Your Gardens</h2>
    <hr />

    <add-garden-component v-bind:uri="uri" v-on:save-add-return="saveAddReturn"></add-garden-component>

   <edit-garden-component
   v-bind:uri="uri"
   v-bind:edit-garden="editGarden"
    v-on:save-edit-return="saveEditReturn"
   >
   </edit-garden-component>

    <p class="errorMessage" v-if="errorMessage">{{errorMessage}}</p>
    <p id="counter">{{counterText}}</p>
    <table class="displayContent">
      <tr>
        <th>Name</th>
        <th>Growing Start Date</th>
        <th>Growing End Date</th>
        <th></th>
        <th></th>
      </tr>
      <tbody>
        <tr v-for="garden in gardens" v-bind:key="garden.id">
          <td>
            <router-link v-bind:to="'/garden/' + garden.id">{{garden.name}}</router-link>
          </td>
          <td>{{garden.growingSeasonStartDate}}</td>
          <td>{{garden.growingSeasonEndDate}}</td>
          <td>
            <button v-on:click="displayEditForm(garden)">Edit</button>
          </td>
          <td>
            <button v-on:click="deletegarden(garden.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { config } from "./js/config";
import { getAccessToken } from "./js/auth";
import addGardenComponent from "./components/Gardens/addGardenComponent";
import editGardenComponent from "./components/Gardens/editGardenComponent";

export default {
  name: "gardens",
  components: {
    "add-garden-component": addGardenComponent,
    "edit-garden-component": editGardenComponent
  },
  data() {
    return {
      gardens: {},
      uri: config.apiURL + "/api/gardens",
      editGarden: null,
      addGarden: {},
      errorMessage: ""
    };
  },
  computed: {
    counterText: function() {
      return (
        this.gardens.length + (this.gardens.length > 1 ? " gardens" : " garden")
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
          this.gardens = data;
        })
        .catch(error => console.error("Unable to get gardens.", error));
    },
    displayEditForm: function(data) {
      this.editGarden = {};
      this.editGarden.name = data.name;
      this.editGarden.growingSeasonStartDate = data.growingSeasonStartDate;
      this.editGarden.growingSeasonEndDate = data.growingSeasonEndDate;
      this.editGarden.id = data.id;
      this.editGarden.width = data.width;
      this.editGarden.length = data.length;
      this.editGarden.measurementType = data.measurementType;
    },
    saveEditReturn: function(savedgarden) {
      let ind = this.gardens.findIndex(x => x.id == savedgarden.id);
      this.gardens[ind] = savedgarden;
      this.editGarden = null;
    },
    saveAddReturn: function(savedgarden) {
      this.gardens.push(savedgarden);
    },
    deletegarden: function(id) {
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
          let ind = this.gardens.findIndex(x => x.id == id);
          this.gardens.splice(ind, 1);
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
