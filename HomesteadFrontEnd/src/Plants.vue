<template>
  <div id="plants">
    <h2>Plants</h2>
    <hr/>
    <h3>Add</h3>
    <form id="AddForm">
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
      <input type="button" value="Add" v-on:click="saveNew(addPlant)" />
    </form>
    <div id="editForm" v-if="editPlant != null">
      <h3>Edit</h3>
      <form id="EditForm" onsubmit="updateItem()">
        <input type="hidden" name="ID" v-model="editPlant.id" id="edit-id" />
        <input type="text" name="name" v-model="editPlant.name" id="edit-name" />
        <input type="text" name="description" v-model="editPlant.description" id="edit-description" />
        <input type="button" value="Save" v-on:click="saveEdit(editPlant)" />
        <a v-on:click="editPlant = null" aria-label="Close">&#10006;</a>
      </form>
    </div>

    <p class="errorMessage" v-if="errorMessage">{{errorMessage}}</p>
    <p id="counter">{{counterText}}</p>
    <table class="displayContent">
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Yield Type</th>
        <th>Plant Group</th>
        <th></th>
        <th></th>
      </tr>
      <tbody>
        <tr v-for="plant in plants" v-bind:key="plant.id">
          <td>{{plant.name}}</td>
          <td>{{plant.description}}</td>
          <td>{{plant.yieldType}}</td>
          <td>
            <p v-if="plant.plantGroup !== null">{{plant.plantGroup.name}}</p>
          </td>
          <td>
            <button v-on:click="displayEditForm(plant)">Edit</button>
          </td>
          <td>
            <button v-on:click="deletePlant(plant.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "plants",
  data() {
    return {
      plants: {},
      uri: "https://localhost:5001/api/plants",
      editPlant: null,
      addPlant: {},
      errorMessage: ""
    };
  },
  computed: {
    counterText: function() {
      return (
        this.plants.length + (this.plants.length > 1 ? " plants" : " plant")
      );
    }
  },
  methods: {
    GetContent: function() {
      fetch(this.uri)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          this.plants = data;
        })
        .catch(error => console.error("Unable to get plants.", error));
    },
    displayEditForm: function(data) {
      this.editPlant = {};
      this.editPlant.name = data.name;
      this.editPlant.description = data.description;
      this.editPlant.id = data.id;
    },
    saveEdit: function(plant) {
      fetch(this.uri + "/" + plant.id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(plant)
      })
        .then(response => response.json())
        .then(savedPlant => {
          let ind = this.plants.findIndex(x => x.id == plant.id);
          this.plants[ind] = savedPlant;
          this.editPlant = null;
        })
        .catch(error => console.error("Unable to update item.", error));
    },
    saveNew: function(plant) {
      fetch(this.uri, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(plant)
      })
        .then(response => response.json())
        .then(savedplant => {
          this.plants.push(savedplant);
          this.addPlant = {};
        })
        .catch(error => console.error("Unable to add item.", error));
    },
    deletePlant: function(id) {
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
          let ind = this.plants.findIndex(x => x.id == id);
          this.plants.splice(ind, 1);
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
