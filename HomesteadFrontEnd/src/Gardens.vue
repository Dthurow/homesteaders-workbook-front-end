<template>
  <div id="gardens">
    <h2>Gardens</h2>
    <hr />
    <h3>Add</h3>
    <form id="AddForm">
      <label for="add-name">Garden Name</label>
      <input
        type="text"
        id="add-name"
        v-model="addGarden.name"
        name="name"
        placeholder="New garden name"
      />
      <label for="add-growing-start-date">Growing Season Start Date (approximate)</label>
      <input
        type="date"
        id="add-growing-start-date"
        v-model="addGarden.growingSeasonStartDate"
        name="growingSeasonStartDate"
        placeholder="Growing Season Start Date"
      />
      <label for="add-growing-end-date">Growing Season End Date (approximate)</label>
      <input
        type="date"
        id="add-growing-end-date"
        v-model="addGarden.growingSeasonEndDate"
        name="growingSeasonEndDate"
        placeholder="Growing Season End Date"
      />
      <input type="button" value="Add" v-on:click="saveNew(addGarden)" />
    </form>
    <div id="editForm" v-if="editGarden != null">
      <h3>Edit</h3>
      <form id="EditForm">
        <input type="hidden" name="ID" v-model="editGarden.id" id="edit-id" />
        <input type="text" name="name" v-model="editGarden.name" id="edit-name" />
        <input type="button" value="Save" v-on:click="saveEdit(editGarden)" />
        <a v-on:click="editGarden = null" aria-label="Close">&#10006;</a>
      </form>
    </div>

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
export default {
  name: "gardens",
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
      fetch(this.uri)
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
    },
    saveEdit: function(garden) {
      fetch(this.uri + "/" + garden.id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(garden)
      })
        .then(response => response.json())
        .then(savedgarden => {
          let ind = this.gardens.findIndex(x => x.id == savedgarden.id);
          this.gardens[ind] = savedgarden;
          this.editGarden = null;
        })
        .catch(error => console.error("Unable to update item.", error));
    },
    saveNew: function(garden) {
      fetch(this.uri, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(garden)
      })
        .then(response => response.json())
        .then(savedgarden => {
          this.gardens.push(savedgarden);
          this.addGarden = {};
        })
        .catch(error => console.error("Unable to add item.", error));
    },
    deletegarden: function(id) {
      fetch(`${this.uri}/${id}`, {
        method: "DELETE"
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
