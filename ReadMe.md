# Homesteader's Workbook Front End
A front-end for the Homesteader's Workbook API, to let end-users create, organize, and plan gardens based on who they're trying to feed (or other reasons).
Current Alpha site at http://homesteadersworkbook.com/


## Functionality
List of functionality this website supports. 

### Completed

#### Garden Planning
* add/edit/delete plants
* add/edit/delete gardens
* If no garden plants related to a plant in the workbook, allow the deletion of the plant
* Add/edit garden plants to gardens that a person owns
* Add/edit a plant group to the workbook

#### Maximizing feeding people

### Need To Be Done

#### Garden Planning
* Have gardens be owned by a person
* Can move garden plants to different gardens that a person owns
* add/move plants into plant groups in the workbook

#### Maximizing feeding people
* People can have a collection of "people-they're-feeding"
* Each person who's being fed has a set of nutritional requirements that need to be met
* The person who creates/owns the gardens also has a set of nutritional requirements
* A person can have a set of plants that they own the seeds/seedlings for
* For a given person and "people they're feeding", generate a garden that most closely matches/exceeds the nutritional requirements of the group, preferably using the seeds they already have first


## Technical To-do's
### Completed
* Create Git Repo
* Create readme with functionality list and tech TO-DOs
* created functional webpack and package config files, use npm/webpack to transpile Vue to javascript
* transfered home, gardens, and plants pages to VueJS equivalant
* create server side code to serve up static files (nodejs express?)
* Complete transfer to VueJS site

### Need to be done
* spin up javascript testing framework
