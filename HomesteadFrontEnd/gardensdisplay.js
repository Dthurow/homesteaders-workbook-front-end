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
  document.getElementById('edit-growingSeasonStartDate').value = new Date(garden.growingSeasonStartDate).toISOString().split('T')[0];
  document.getElementById('edit-growingSeasonEndDate').value = new Date(garden.growingSeasonEndDate).toISOString().split('T')[0];
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
    let tdArray = [];
    let editButton = button.cloneNode(false);
    editButton.innerText = 'Edit';
    editButton.setAttribute('onclick', `displayEditForm(${garden.id})`);

    let deleteButton = button.cloneNode(false);
    deleteButton.innerText = 'Delete';
    deleteButton.setAttribute('onclick', `deleteItem(${garden.id})`);

    let gardenLink = document.createElement("a");
    gardenLink.href = "garden.html?ID=" + garden.id;
    gardenLink.innerText = garden.name;

    

    tdArray.push(gardenLink);
    tdArray.push(document.createTextNode(new Date(garden.growingSeasonStartDate).toDateString()));
    tdArray.push(document.createTextNode(new Date(garden.growingSeasonEndDate).toDateString()));
    tdArray.push(editButton);
    tdArray.push(deleteButton);


    let tr = tBody.insertRow();

    for (let i = 0; i < tdArray.length; i++)
    {
      tr.insertCell(i).appendChild(tdArray[i]);
    }

  });

  gardens = data;
}