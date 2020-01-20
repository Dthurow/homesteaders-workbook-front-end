uri = 'https://localhost:5001/api/gardens';
let gardens = [];

function getContent()
{
  fetch(uri)
    .then(response => response.json())
    .then(data => _displayGardens(data))
    .catch(error => console.error('Unable to get gardens.', error));
}

function displayEditForm(id)
{
  const garden = gardens.find(garden => garden.id === id);

  document.getElementById('edit-name').value = garden.name;
  document.getElementById('edit-id').value = garden.id;
  document.getElementById('editForm').style.display = 'block';
}

function _displayCount(count)
{
  const name = (count === 1) ? 'garden' : 'gardens';

  document.getElementById('counter').innerText = `${count} ${name}`;
}

function _displayGardens(data)
{
  const tBody = document.getElementById('gardens');
  tBody.innerHTML = '';

  _displayCount(data.length);

  const button = document.createElement('button');

  data.forEach(garden =>
  {

    let editButton = button.cloneNode(false);
    editButton.innerText = 'Edit';
    editButton.setAttribute('onclick', `displayEditForm(${garden.id})`);

    let deleteButton = button.cloneNode(false);
    deleteButton.innerText = 'Delete';
    deleteButton.setAttribute('onclick', `deleteItem(${garden.id})`);

    let tr = tBody.insertRow();

    let td1 = tr.insertCell(0);
    let gardenLink = document.createElement("a");
    gardenLink.href = "garden.html?ID=" + garden.id;
    gardenLink.innerText = garden.name;
    td1.appendChild(gardenLink);


    let td2 = tr.insertCell(1);
    td2.appendChild(editButton);

    let td3 = tr.insertCell(2);
    td3.appendChild(deleteButton);
  });

  gardens = data;
}