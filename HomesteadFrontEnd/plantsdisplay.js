uri = 'https://localhost:5001/api/plants';
let plants = [];

function getContent()
{
  fetch(uri)
    .then(response => response.json())
    .then(data => _displayPlants(data))
    .catch(error => console.error('Unable to get plants.', error));
}

function displayEditForm(id)
{
  const plant = plants.find(plant => plant.id === id);

  document.getElementById('edit-name').value = plant.name;
  document.getElementById('edit-id').value = plant.id;
  document.getElementById('edit-description').value = plant.description;
  document.getElementById('editForm').style.display = 'block';
}

function _displayCount(count)
{
  const name = (count === 1) ? 'plant' : 'plants';

  document.getElementById('counter').innerText = `${count} ${name}`;
}

function _displayPlants(data)
{
  const tBody = document.getElementById('plants');
  tBody.innerHTML = '';

  _displayCount(data.length);

  const button = document.createElement('button');

  data.forEach(plant =>
  {

    let editButton = button.cloneNode(false);
    editButton.innerText = 'Edit';
    editButton.setAttribute('onclick', `displayEditForm(${plant.id})`);

    let deleteButton = button.cloneNode(false);
    deleteButton.innerText = 'Delete';
    deleteButton.setAttribute('onclick', `deleteItem(${plant.id})`);

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