let app = new Vue({
    el: '#app',
    data: {
        plants: {},
        uri: 'https://localhost:5001/api/plants',
        editPlant: null,
        addPlant: {},
        errorMessage: ""
    },
    computed: {
        counterText: function ()
        {
            return this.plants.length + (this.plants.length > 1 ? " plants" : " plant");
        }
    },
    methods: {
        GetContent: function ()
        {
            fetch(this.uri)
                .then(response => response.json())
                .then(data =>
                {
                    console.log(data);
                    this.plants = data;

                })
                .catch(error => console.error('Unable to get plants.', error));

        },
        displayEditForm: function (data)
        {
            this.editPlant = data;
        },
        saveEdit: function (plant)
        {
            fetch(this.uri + "/" + plant.id, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(plant)
            })
                .then(() =>
                {
                    let ind = this.plants.findIndex(x => x.id == plant.id);
                    this.plants[ind] = plant;
                    this.editPlant = null;
                })
                .catch(error => console.error('Unable to update item.', error));

        },
        saveNew: function (plant)
        {
            fetch(this.uri, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(plant)
            })
                .then(response => response.json())
                .then((savedplant) =>
                {
                    this.plants.push(savedplant);
                    this.addPlant = {};
                })
                .catch(error => console.error('Unable to add item.', error));
        },
        deletePlant: function (id)
        {
            fetch(`${this.uri}/${id}`, {
                method: 'DELETE'
            })
                .then(response =>
                {
                    if (!response.ok)
                    {
                        response.json().then(x=>{
                            this.errorMessage = x.detail;
                        });
                        throw new Error('error');
                    }
                })
                .then(() =>
                {

                    let ind = this.plants.findIndex(x => x.id == id);
                    this.plants.splice(ind, 1);

                })
                .catch(error =>
                {
                    console.log('Unable to delete item.', error)
                });
        }
    },
    created: function ()
    {
        this.GetContent()
    }
})