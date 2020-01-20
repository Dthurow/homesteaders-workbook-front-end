uri = 'https://localhost:5001/api/gardenplants';
let gardenplants = [];
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
    }
        
}

function displayEditForm(id)
{
    const garden = gardenplants.find(garden => garden.id === id);

    document.getElementById('edit-name').value = garden.name;
    document.getElementById('edit-id').value = garden.id;
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

            let editButton = button.cloneNode(false);
            editButton.innerText = 'Edit';
            editButton.setAttribute('onclick', `displayEditForm(${gardenplant.id})`);

            let deleteButton = button.cloneNode(false);
            deleteButton.innerText = 'Delete';
            deleteButton.setAttribute('onclick', `deleteItem(${gardenplant.id})`);

            let tr = tBody.insertRow();

            let td1 = tr.insertCell(0);
            td1.appendChild(document.createTextNode(gardenplant.name));


            let td2 = tr.insertCell(1);
            td2.appendChild(editButton);

            let td3 = tr.insertCell(2);
            td3.appendChild(deleteButton);
        });

    }




    gardenplants = data.gardenPlants;
}