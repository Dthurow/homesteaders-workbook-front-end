const uri = 'https://localhost:5001/api/plants';
let plants = [];

function getPlants() {
  fetch(uri)
    .then(response => response.json())
    .then(data => _displayPlants(data))
    .catch(error => console.error('Unable to get plants.', error));
}

function addPlant() {
  const addNameTextbox = document.getElementById('add-name');
  const addDescriptionTextbox = document.getElementById('add-description');

  const plant = {
    name: addNameTextbox.value.trim(),
    description: addDescriptionTextbox.value.trim()
  };

  fetch(uri, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(plant)
  })
    .then(response => response.json())
    .then(() => {
      getPlants();
      addNameTextbox.value = '';
      addDescriptionTextbox.value = '';
    })
    .catch(error => console.error('Unable to add plant.', error));
}

function deletePlant(id) {
  fetch(`${uri}/${id}`, {
    method: 'DELETE'
  })
  .then(() => getPlants())
  .catch(error => console.error('Unable to delete plant.', error));
}

function displayEditForm(id) {
  const plant = plants.find(plant => plant.id === id);
  
  document.getElementById('edit-name').value = plant.name;
  document.getElementById('edit-id').value = plant.id;
  document.getElementById('edit-description').value = plant.description;
  document.getElementById('editForm').style.display = 'block';
}

function updatePlant() {
  const plantId = document.getElementById('edit-id').value;
  const plant = {
    id: parseInt(plantId, 10),
    description: document.getElementById('edit-description').value.trim(),
    name: document.getElementById('edit-name').value.trim()
  };

  fetch(`${uri}/${plantId}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(plant)
  })
  .then(() => getPlants())
  .catch(error => console.error('Unable to update plant.', error));

  closeInput();

  return false;
}

function closeInput() {
  document.getElementById('editForm').style.display = 'none';
}

function _displayCount(plantCount) {
  const name = (plantCount === 1) ? 'plant' : 'plants';

  document.getElementById('counter').innerText = `${plantCount} ${name}`;
}

function _displayPlants(data) {
  const tBody = document.getElementById('plants');
  tBody.innerHTML = '';

  _displayCount(data.length);

  const button = document.createElement('button');

  data.forEach(plant => {

    let editButton = button.cloneNode(false);
    editButton.innerText = 'Edit';
    editButton.setAttribute('onclick', `displayEditForm(${plant.id})`);

    let deleteButton = button.cloneNode(false);
    deleteButton.innerText = 'Delete';
    deleteButton.setAttribute('onclick', `deletePlant(${plant.id})`);

    let tr = tBody.insertRow();
    
    let td1 = tr.insertCell(0);
    let textNode = document.createTextNode(plant.name);
    td1.appendChild(textNode);

    let td2 = tr.insertCell(1);
    let descriptionNode = document.createTextNode(plant.description);
    td2.appendChild(descriptionNode);

    let td3 = tr.insertCell(2);
    td3.appendChild(editButton);

    let td4 = tr.insertCell(3);
    td4.appendChild(deleteButton);
  });

  plants = data;
}