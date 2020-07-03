<template>
  <div style="margin-bottom:50px;">
    <h2>Intro to the Homesteader's Workbook</h2>
    <p>
      This page will help you enter the info needed to start tracking your garden, as well as give a little bit of overview
      on how the homesteader's workbook is set up. Let's get started!
    </p>

    <h2>The Plants</h2>
    <p>
      Since the main goal of this project is to track plants, it makes sense they take center stage!
      Plants start their life in your
      <router-link v-bind:to="{name: 'seedchest'}">seed chest</router-link>.
      The seed chest assumes the plants are either packets of seeds, or seedlings that you haven't gotten
      around to planting in your gardens yet.
    </p>
    <p>
      You add a plant to your seed chest by inputting info about it: The variety name, how much of it you have
      (e.g. how big of a packet of seeds), extra descriptions, and two things that are unique to the homesteader's
      workbook: Food Category and Plant Group
    </p>
    <h3>Food Category</h3>
    <p>
      Food categories are used to group plants based on their general nutritional values. Setting their types helps
      the Homesteader's Workbook to calculate nutritional needs of the people you want to feed.
      It'll be able to easily check what plants you're currently growing or can grow, and how that compares to the
      nutritional requirements of the group of people. This lets it give you best guess recommendations on what to
      grow in order to support you and the people you're caring for!
    </p>
    <p>
      The Food Categories do not rely on knowing the exact nutritional make-up of the plants you're growing, and
      instead rely on generalization. So the calculations for plants you need to grow wont be perfectly balanced,
      nutrionally-speaking, but growing things is inherently at least a
      <b>little</b> bit of guesswork, so not
      being exact isn't the end of the world. Homesteader's workbook actually suggests growing slightly more than you
      officially need specifically because of this. Having poor yields or bad luck is assumed to happen, so if you
      follow the Homesteader's Workbook plan, you should at worst have a bit of extra yield that you can preserve for
      the next year.
    </p>
    <h3>Plant Group</h3>
    <p>
      Plant groups allow you to organize your plants. You can group them by varieties, heirloom, type, cultivars,
      or whatever makes the most sense to you. For example, say you have 3 different varieties of tomatoes you
      want to plant: Cherry, Beefsteak, and Pear tomatoes. Before you create the plant, you have to create the Plant Group
      you want them in. In this example, let's say you want to group them by "Tomato".
    </p>
    <div>
      Some other examples of uses:
      <ul>
        <li>grouping varieties together (e.g. a plant group called "Mint", that you use to group your peppermint and spearmint together)</li>
        <li>grouping plant families (e.g. a plant group called "brassica", that you group your cauliflower, rutabaga and kale together)</li>
        <li>group by cold weather hardiness, personal favorites, etc!</li>
      </ul>
      <p v-if="plantGroups.length == 0">Try it yourself by adding a plant group below!</p>
    </div>
    <add-plant-group-component
      v-if="plantGroups.length == 0"
      v-bind:uri="plantgroupURI"
      v-bind:plant-groups="plantGroups"
      v-on:save-add-plant-group-return="saveAddPlantGroupReturn"
    ></add-plant-group-component>

    <div v-if="plantGroups.length > 0">
      <p>
        <b>Congrats on adding your first Plant Group!</b>
      </p>
      <p>
        If you'd like to create more Plant Groups, click on "Plant Groups" in the menu bar at the top of the page,
        or click on the words
        <router-link v-bind:to="{name: 'plantgroups'}">Plant Group</router-link>to go there directly.
      </p>
      <div class="specialAlert">
        Plant group Name: {{plantGroups[0].name}}
        <br />
        Plant group Description: {{plantGroups[0].description}}
      </div>
      <p>
        Now that you've added your first Plant Group, you can add your first plant! This plant will be stored in your
        <router-link v-bind:to="{name: 'seedchest'}">seed chest</router-link>. And you'll be able to look at it or
        edit it later there. Having your plants in your seed chest is important because you wont be able to add any
        plants to your garden that you haven't added to your seed chest first.
      </p>
      <p>
        <b>NOTE:</b> Post-Alpha, the plan is if you already have a list of your plants elsewhere, you'll be able to upload
        them and automatically create plants in your seed chest. This functionality has not been created yet, however.
      </p>
      <p v-if="plants.length == 0">
        Click below to fill in the info for your new plant. If we're continuing the example earlier,
        put in "Cherry Tomato" as the name, with whatever description you want. The Amount is a
        number, with a dropdown that lets you choose different units (e.g. milligrams).
        Set the Plant Group you made, and Food Category, then click Add!
      </p>

      <add-plant-component
        v-if="plants.length == 0"
        v-bind:uri="plantURI"
        v-bind:plant-groups="plantGroups"
        v-on:save-add-return="saveAddReturn"
        v-on:save-add-plant-group-return="saveAddPlantGroupReturn"
      ></add-plant-component>

      <div v-if="plants.length > 0">
        <p>
          <b>Congrats on adding your first Plant!</b>
        </p>
        <div class="specialAlert">
          Plant Name: {{plants[0].name}}
          <br />
          Plant Description: {{plants[0].description}}
        </div>
        <p>
          Now that you've created your first Plant and Plant Group, we can move on to the next important section of the
          Homesteader's Workbook: The Garden!
        </p>
        <h2>The Garden</h2>
        <p>
          <b>TODO</b>
        </p>
      </div>
    </div>
  </div>
</template>


<script>
import { config } from "./js/config";
import addPlantGroupComponent from "./components/PlantGroups/addPlantGroupComponent";
import addPlantComponent from "./components/Plants/addPlantComponent";
import { getAccessToken } from "./js/auth";

export default {
  name: "intro",
  data() {
    return {
      plantgroupURI: config.apiURL + "/api/plantgroups",
      plantURI: config.apiURL + "/api/plants",
      plantGroups: [],
      plants: []
    };
  },
  components: {
    "add-plant-group-component": addPlantGroupComponent,
    "add-plant-component": addPlantComponent
  },
  methods: {
    GetContent: function() {
      fetch(this.plantgroupURI, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          this.plantGroups = data;
        })
        .catch(error => logging.error("Unable to get plant groups. " + error));

      fetch(this.plantURI, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          this.plants = data;
        })
        .catch(error => logging.error("Unable to get plants. " + error));
    },
    saveAddReturn: function(savedplant) {
      this.plants.push(savedplant);
    },
    saveAddPlantGroupReturn: function(savedPlantGroup) {
      this.plantGroups.push(savedPlantGroup);
    }
  },
  created: function() {
    this.GetContent();
  }
};
</script>

<style>
</style>