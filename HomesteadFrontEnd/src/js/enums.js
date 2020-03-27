
export const PlantingTypes = [

    {id:0, name:"rowFeet"},
    {id:1, name:"individual"}

];

//this is a enum in code so it's 0-indexed
export const PlantAmountTypes = [

    {
        id: 0,
        name: "ounces"
    },
    {
        id: 1,
        name: "grams"
    },
    {
        id: 2,
        name: "milligrams"
    },
    {
        id: 3,
        name: "seeds"
    }

];

export const YieldTypes = [

    { id:0, name:"Pounds"},
    { id:1, name:"Kilograms"},
    { id:2, name:"Bushels"},
    { id:3, name:"Ounces"}

];

export const MeasurementTypes = [
    { id: 0, name: "feet" },
    { id: 1, name: "inches" },
    { id: 2, name: "meters" },
    { id: 3, name: "centimeters" }
]


//this is a db entity so its 1-indexed
export const FoodCategories = [
    {
        id: 1,
        name: "citrus/tomato"
    },
    {
        id: 2,
        name: "grn/ylw veg"
    },
    {
        id: 3,
        name: "potatoes"
    },
    {
        id: 4,
        name: "other frt/veg"
    },
    {
        id: 5,
        name: "grains"
    },
    {
        id: 6,
        name: "dry bns/peas/nuts"
    },

];