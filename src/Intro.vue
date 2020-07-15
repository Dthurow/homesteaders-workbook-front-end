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
        <router-link v-bind:to="{name: 'plantgroups'}">Plant Group</router-link>&nbsp;to go there directly.
      </p>
      <div class="specialAlert">
        Plant group Name: {{plantGroups[0].name}}
        <br />
        Plant group Description: {{plantGroups[0].description}}
      </div>
      <h3>Plant</h3>
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
        <h2>The Gardens</h2>
        <h3>Garden</h3>
        <p>
          The gardens are where you, well, garden. You can organize your planted plants by what garden you put them in.
          In this way you can track your herb garden, veggie garden, etc. in separate areas. This can help later when
          you're entering harvest data. You don't have to scroll through every plant you have planted in order to find
          the ones you harvested from. You may also want to plant the same plant in different garden locations, and this
          lets you do it!
        </p>
        <p>
          If you only have one garden, or don't really care about organizing your plants this way, you can always just
          create a single garden that contains all plants you planted for a given growing season.
        </p>
        <p>
          So let's create our first garden! Click the "Add Garden" button below and fill out the info. It's pretty simple
          info you need: The garden name, the growing season it's for (just guess if you're not sure, you can always change
          it later), and the size of your garden.
        </p>
        <add-garden-component
          v-if="gardens.length == 0"
          v-bind:uri="gardensURI"
          v-on:save-add-return="saveAddGardensReturn"
        ></add-garden-component>

        <div v-if="gardens.length > 0">
          <p>
            <b>Congrats on adding your first Garden!</b>
          </p>
          <div class="specialAlert">Garden Name: {{gardens[0].name}}</div>

          <p>
            Gardens can be viewed by going to the
            <router-link v-bind:to="{name: 'gardens'}">Your Gardens</router-link>&nbsp;link in the menu bar at the top of the page. You can then
            click on a specific garden in the list to see the plants inside your garden.
          </p>

          <h3>Garden Plants</h3>
          <p>
            We can finally get to the good stuff: planting your plants! With your first garden created, and plants
            in your seed chest, you can go to your individual garden and start planting plants. Since we're walking
            through an intro, lets add some of the {{plants[0].name}} plants into your {{gardens[0].name}} garden.
          </p>
          <p>
            When you first click the "Add Plant To My Garden", you're presented with a search box. You can start typing
            the plant that you added to your seed chest, and it will appear in a list below the box. Select that plant,
            and then enter how much you're planting, and how much you hope to harvest from the plant.
          </p>
          <p>
            When selecting how much you're planting, you can choose either listing per linear foot, or per individual
            plant. So if you're planting a 20 foot row or 3 plants, you'll be able to track it.
            Based on which way you're tracking how much, the yield you enter should be either per linear foot or
            individual plant. In the future, you'll be able to see how much you harvested in previous years, and your
            yield estimate will become more accurate. For now, however, you'll have to guess and refine it as you go.
            If you research your particular varieties online, you can often find rough yield estimates that you can then
            add here.
          </p>

          <add-garden-plant-component
            v-if="gardenPlants.length == 0"
            v-bind:uri="gardenPlantURI"
            v-bind:garden="garden"
            v-on:save-add-garden-plant-return="saveGardenPlantAddReturn"
          ></add-garden-plant-component>

          <div v-if="gardenPlants.length > 0">
            <p>
              <b>Congrats on adding your first Garden Plant!</b>
            </p>
            <div class="specialAlert">
              Garden Plant Name: {{gardenPlants[0].name}}
              <br />
              Amount Planted: {{gardenPlants[0].amountPlanted}} {{gardenPlants[0].amountPlantedType}}
              <br />

              Estimated Yield Per {{gardenPlants[0].amountPlantedType}}: {{gardenPlants[0].yieldEstimatedPerAmountPlanted}} {{gardenPlants[0].yieldType}}
            </div>

            <h3>Harvests</h3>
            <p>
              TODO
              </p>


          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { config } from "./js/config";
import addPlantGroupComponent from "./components/PlantGroups/addPlantGroupComponent";
import addPlantComponent from "./components/Plants/addPlantComponent";
import addGardenComponent from "./components/Gardens/addGardenComponent";
import addGardenPlantComponent from "./components/Garden/addGardenPlantComponent";
import { getAccessToken } from "./js/auth";

export default {
  name: "intro",
  data() {
    return {
      plantgroupURI: config.apiURL + "/api/plantgroups",
      plantURI: config.apiURL + "/api/plants",
      gardensURI: config.apiURL + "/api/gardens",
      gardenPlantURI: config.apiURL + "/api/gardenplants",
      plantGroups: [],
      plants: [],
      gardens: [],
      garden: {},
      gardenPlants: []
    };
  },
  components: {
    "add-plant-group-component": addPlantGroupComponent,
    "add-plant-component": addPlantComponent,
    "add-garden-component": addGardenComponent,
    "add-garden-plant-component": addGardenPlantComponent
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
          this.plants = data;
        })
        .catch(error => logging.error("Unable to get plants. " + error));

      fetch(this.gardensURI, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      })
        .then(response => response.json())
        .then(data => {
          this.gardens = data;
          this.garden = this.gardens[0];
          this.gardenPlants = this.garden.gardenPlants;
        })
        .catch(error =>
          logging.error(
            "Unable to get gardens. using this uri: " +
              this.gardensURI +
              " error was " +
              error
          )
        );
    },
    saveAddReturn: function(savedplant) {
      this.plants.push(savedplant);
    },
    saveAddPlantGroupReturn: function(savedPlantGroup) {
      this.plantGroups.push(savedPlantGroup);
    },
    saveAddGardensReturn: function(savedgarden) {
      this.gardens.push(savedgarden);
      this.garden = savedgarden;
    },
    saveGardenPlantAddReturn: function(savedgardenplant) {
      this.gardenPlants.push(savedgardenplant);
    }
  },
  created: function() {
    this.GetContent();
  }
};
</script>

<style>
</style>