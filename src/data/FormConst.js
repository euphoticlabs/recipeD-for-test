export const S3_URL = "https://amplify-noshapp-dev-124225-deployment.s3.ap-south-1.amazonaws.com/";

export const initialInputs =  {
  "DishID": "",
  "PrepTime": "",
  "AdditionalInstructions": "",
  "CookTime": "",
  "DishName": "",
  "Version": "",
  "Creator": "",
  "Course": "",
  "Cuisine": "",
  "Type": "",
  "Servings": "1",
  "Oil": 0,
  "Water": 0,
  "MainIngredient": "",
  "Consistency": "",
  "Flavor1": "",
  "Flavor2": "",
  // "CookMoreInstructions" : {
  //   "stove_heat": "",
  //   "stove_command": "",
  // },  
}

export const initialSpices = {
  "Chilli powder": "0",
  "Coriander Powder": "0",
  "Cumin": "0",
  "Cumin Powder": "0",
  "Garam masala": "0",
  "Hing": "0",
  "Kitchen King": "0",
  "Mustard": "0",
  "Salt": "0",
  "Turmeric": "0"
};

export const choppingStyles = [
  "Batons (french fries cut)",
"Big florets",
"Boiled",
"Chopped",
"Clove",
"Coarse",
"Diagonals",
"Diamonds",
"Dice(cube)",
"Dry",
"Fine Dice(cube)",
"Fine chopped",
"Florets",
"Grated",
"Julienne(match sticks)",
"Kernels",
"Large Dice(cube)",
"Mince",
"Paste",
"Powder",
"Puree",
"Raw",
"Rounds",
"Semi rounds",
"Shredds",
"Slit/Split",
"Soaked",
"Thick sliced",
"Thin sliced",
"Wedges",
"Whole"
];

export const allergensNames = [
  "Milk",
  "Eggs",
  "Peanut",
  "Shellfish",
  "Wheat",
  "Soya",
  "Fish",
  "Tree nuts"
];

export const courseOptions = [
  // "-",
  "",
  "Main",
  "Breakfast",
  "Dessert",
  "Appetizer",
  "Soup",
  "Dinner"
];

export const cuisineOptions = [
  "",
  "Indian",
  "Continental",
  "Oriental"
];

export const dishTypeOptions = [
  "",
  "Vegetarian",
  "Non-Vegetarian",
  "Eggetarian"
];

export const servingsOptions = [
  "1",
  "2",
  "3",
  "4"
];

export const ingredientObj = {
  "Slot": "",
  "Ingredient": "",
  "id": "",
  "Chopping Style": "",
  "Factor": "",
  "Ingredient Type": "",
  "Quantity": "",
  "Source": "",
  "Unit": "",
  "Shopping unit": "",
  "optional": false,
  "forMarination": false,
}


export const cuisineMap = {
  'Indian': 'INDN',
  'Continental': 'CNTL',
  'Oriental': 'ONTL'
};
export const courseMap = {
  'Main': 'MAIN',
  'Breakfast': 'BRKF',
  'Dessert': 'DESS',
  'Appetizer': 'APTR',
  'Soup': 'SOUP',
  'Dinner': 'DINN'
}
export const typeMap = {
  'Vegetarian': 'VT',
  'Non-Vegetarian': 'NV',
  'Eggetarian': 'EG'
}

export const resetInputUtil = (className) => {
  const elements = document.getElementsByClassName(className);
  for (let i = 0; i < elements.length; i++) {
    elements[i].value = '';
  }
}

//NSSB-18: Recipe Dashboard Update - units to select from shopping unit and display unit dropdown
export const ingredientUnits = [
  "clove",
  "unit",
  "cup",
  "tsp",
  "tbsp",
  "cube",
  "grams",
  "ml"
];

export const flavorOptions = [
  "",
  "Spicy",
  "Earthy",
  "Tangy",
  "Creamy",
  "Sour",
  "Garlicky",
  "Savoury",
  "Nutty",
  "Sweet",
  "Buttery",
  "Spicy-sour",
  "Sweet-scipy"
];

export const ingredientsFamilyOptions = [
  "",
  "Cheese",
  "Marine",
  "Poultry",
  "Rice",
  "Red-meat",
  "Potato",
  "Leafy",
  "Lentils",
  "Pasta",
  "Vegetables",
  "Grains",
  "Ghee-based"
];

export const consistencyOptions = [
  "",
  "Dry", 
  "Semi-gravy", 
  "Gravy", 
  "Whole-meal"
]

export const stoveCommands = [
  "mix",
  "mix_through",
  "rest"
]