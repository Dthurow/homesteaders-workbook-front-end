let uri = '';

function getContent()
{
  console.log('accessing base getContent, not overriden version');
}

function addItem()
{
  const addFormObj = document.getElementById('AddForm');
  let addedObject = {};
  for (let i = 0; i < addFormObj.elements.length; i++)
  {
    let curElement = addFormObj.elements[i];
    if (curElement["type"] === "text")
    {
      addedObject[curElement["name"]] = curElement["value"];
    }
  }

  fetch(uri, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(addedObject)
  })
    .then(response => response.json())
    .then(() =>
    {
      getContent();
      for (let i = 0; i < addFormObj.elements.length; i++)
      {
        let curElement = addFormObj.elements[i];
        if (curElement["type"] === "text")
        {
          curElement["value"] = "";
        }
      }
    })
    .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id)
{
  fetch(`${uri}/${id}`, {
    method: 'DELETE'
  })
    .then(() => getContent())
    .catch(error => console.error('Unable to delete item.', error));
}

function updateItem()
{

  const editFormObj = document.getElementById('EditForm');
  let editedObject = {};
  for (let i = 0; i < editFormObj.elements.length; i++)
  {
    let curElement = editFormObj.elements[i];
    if (curElement["type"] === "text" || curElement["type"] === "hidden")
    {
      editedObject[curElement["name"]] = curElement["value"];
    }
  }

  fetch(`${uri}/${editedObject.ID}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(editedObject)
  })
    .then(() => getContent())
    .catch(error => console.error('Unable to update item.', error));

  closeInput();

  return false;
}

function closeInput()
{
  document.getElementById('editForm').style.display = 'none';
}
