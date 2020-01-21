uri = 'https://localhost:5001/api/gardenplants';
let gardenplants = [];
let plants = [];
let params = (new URL(document.location)).searchParams;


function getContent()
{
    if (params.has("ID"))
    {
        let getURI = 'https://localhost:5001/api/gardens/' + params.get("ID");

        fetch(getURI)
            .then(response => response.json())
            .then(data => _displayGardenPlants(data))
            .catch(error => console.error('Unable to get gardens.', error));

        fetch('https://localhost:5001/api/plants')
            .then(response => response.json())
            .then(data => plants = data)
            .catch(error => console.log("unable to get plants.", error));

    }

}

function displayEditForm(id, plantid)
{
    const gardenplant = gardenplants.find(gardenplant => gardenplant.id === id);

    document.getElementById('edit-name').value = gardenplant.name;
    document.getElementById('edit-id').value = gardenplant.id;
    document.getElementById('edit-count').value = gardenplant.count;
    document.getElementById('edit-plantid').value = plantid;
    document.getElementById('editForm').style.display = 'block';
}

function _displayCount(count)
{
    const name = (count === 1) ? 'plant in the garden' : 'plants in the garden';

    document.getElementById('counter').innerText = `${count} ${name}`;
}

function _displayGardenPlants(data)
{
    const tBody = document.getElementById('gardenplants');
    tBody.innerHTML = '';
    let gardenName = document.getElementById('GardenName');
    gardenName.innerText = data.name;

    if (data.gardenPlants !== null && data.gardenPlants.length > 0)
    {

        _displayCount(data.gardenPlants.length);

        const button = document.createElement('button');

        data.gardenPlants.forEach(gardenplant =>
        {
            let tdArray = [];
            let editButton = button.cloneNode(false);
            editButton.innerText = 'Edit';
            editButton.setAttribute('onclick', `displayEditForm(${gardenplant.id}, ${gardenplant.plantID})`);

            let deleteButton = button.cloneNode(false);
            deleteButton.innerText = 'Delete';
            deleteButton.setAttribute('onclick', `deleteItem(${gardenplant.id})`);

            tdArray.push(document.createTextNode(gardenplant.name));
            tdArray.push(document.createTextNode(gardenplant.count));
            tdArray.push(editButton);
            tdArray.push(deleteButton);

            let tr = tBody.insertRow();

            for (let i = 0; i < tdArray.length; i++)
            {
                tr.insertCell(i).appendChild(tdArray[i]);
            }
        });

    }




    gardenplants = data.gardenPlants;
}

function displayPlantSearch(prefix)
{
    let searchText = document.getElementById(prefix + '-plantname').value;

    if (searchText !== null && searchText !== "")
    {
        const tBody = document.getElementById('plantSearch');
        tBody.innerHTML = '';
        document.getElementById('plantSearchTable').style.display = 'block';
        let foundPlantArray = plants.filter(plant => plant.name.includes(searchText));

        const button = document.createElement('button');

        foundPlantArray.forEach(plant =>
        {
            let useButton = button.cloneNode(false);
            useButton.innerText = 'Use';
            useButton.setAttribute('onclick', `usePlantInEditForm(${plant.id}, '${plant.name}', '${prefix}')`);

            let tr = tBody.insertRow();

            let td1 = tr.insertCell(0);
            td1.appendChild(document.createTextNode(plant.name));


            let td2 = tr.insertCell(1);
            td2.appendChild(useButton);

        });
    }
    else
    {

    }


}

function usePlantInEditForm(id, name, prefix)
{
    document.getElementById(prefix + "-plantid").value = id;
    document.getElementById(prefix + "-plantname").value = name;
    document.getElementById('plantSearchTable').style.display = 'none';
}