import React, { useEffect, useState } from 'react';
import * as FormConst from '../data/FormConst';
import AlertError  from '../AlertError';
import AlertSuccess from '../AlertSuccess';
import '../App.css'
import Layout from './Layout'
import Input from '../components/Input';
import Spice from '../components/Spice';
import Allergen from '../components/Allergen';
import Ingredients from '../components/Ingredients';
import FileInput from '../components/FileInput';
import { useLocation } from 'react-router-dom';

var finalRes = {};
let allergens = [];
const AddMoreServings = () => {

  const [inputs, setInputs] = useState(FormConst.initialInputs);
  const [slots, updateSlots] = useState([{...FormConst.ingredientObj}]);
  const [spices, setSpices] = useState(FormConst.initialSpices);
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [formErrors, setFormErrors] = useState([]);
  // const [previewDish, setPreviewDish] = useState();
  // const [previewTray, setPreviewTray] = useState();
  const { state } = useLocation();
  const [servings, setServings] = useState([]);

  useEffect(()=>{
    console.log(state);
    const tempServings = [];
    for (let i = 0; i < FormConst.servingsOptions.length; i++){
        if (state['ExistingServings'].includes(FormConst.servingsOptions[i]))
            continue;
        tempServings.push(FormConst.servingsOptions[i]);
    }
    setServings(tempServings);

    for (let i in FormConst.initialInputs){
      if (state['Info'][i]) setInputs(prev=>({...prev, [i]: state['Info'][i]}));
      if (state['Recipe'][i]) setInputs(prev=>({...prev, [i]: state['Recipe'][i]}));
    }
    const temp = state['Recipe']['Ingredients']['Slots'];
    const arr = [];
    // console.log(`temp: ${temp}`);
    for (let slot in temp){
      let slotArr = temp[slot];
      // console.log(`SlotArr: ${slotArr}`);
      for (let i = 0; i < slotArr.length; i++){
        slotArr[i]['Slot'] = slot[slot.length-1];
      }
      arr.push(...slotArr);
    }
    updateSlots(arr);
    // const dishUrl = `${FormConst.S3_URL}${state['Info']['DishImage']}`;
    // const trayUrl = `${FormConst.S3_URL}${state['Info']['TrayImage']}`;
    // setInputs(prev => ({...prev, 'dish_image': state['Info']['DishImage']}));
    // setInputs(prev => ({...prev, 'tray_image': state['Info']['TrayImage']}));
    // setPreviewDish(dishUrl);
    // setPreviewTray(trayUrl);
    const cookMoreInstructions = state['Recipe']['CookMoreInstructions'];

    setInputs((prev) => ({
      ...prev,
      'AdditionalInstructions': state['Recipe']['Additional Instructions'].join(','),
      'stove_heat': cookMoreInstructions?.['stove_heat'] !== undefined ? cookMoreInstructions['stove_heat'].toString() : '4',
      'stove_command': cookMoreInstructions?.['stove_command'] !== undefined ? cookMoreInstructions['stove_command'] : 'mix',
    }));

  }, [state, updateSlots]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs(prevInputs => ({...prevInputs, [name]: value}));
  }

  const handleAllergenBoxClick = (e) => {
    let element = document.getElementById(`allergen#${e.target.innerText}`);
    let index = allergens.indexOf(e.target.innerText);
    if (index !== -1) {
      element.style.backgroundColor = 'white';
      element.style.color = 'black';
      allergens.splice(index, 1);
    } 
    else {
      element.style.backgroundColor = 'grey';
      element.style.color = 'white';
      allergens.push(e.target.innerText);
    }
  }

  const handleSpiceQtyChange = (event) => {
    const { name, value } = event.target;
    let qty = Number(document.getElementById(name).innerText);
    qty = value === "+" ? ++qty : (qty>0) ? --qty : qty;
    setSpices(prev => ({
      ...prev,
      [name]: "" + qty
    }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setSubmitting(true);
    try {
      const dishID = state['Recipe']['DishID'];

      const dish_info = {
        "DishID": dishID,
        "SK": `INFO#${dishID}`,
        "Recipes": [
          ...state['Info']['Recipes'],
          `${inputs["Servings"]}-${inputs["Version"]}`
        ],
      };

      
      // const dishFeaturesData = {
      //   "DishID": state['Info']['DishID'],
      //   "Consistency" : inputs["Consistency"],
      //   "MainIngredient" : inputs["MainIngredient"],
      //   "Flavor1" : inputs["Flavor1"],
      //   "Flavor2" : inputs["Flavor2"],
      //   "DishID": "91-VT-INDN-MAIN",
      //   "Type": inputs["Type"],
      //   "Course": inputs["Course"],
      //   "Cuisine": inputs["Cuisine"],
      //   "DishName": inputs["DishName"],
      // }

      const finalSlots = {
        "Slot1": [],
        "Slot2": [],
        "Slot3": [],
        "Slot4": [],
        "Slot5": [],
    }

    for (let i =0; i < slots.length; i++) {
        const obj = slots[i];
        const slot_n = obj['Slot'];
        delete obj['Slot'];
        finalSlots[`Slot${slot_n}`].push(obj);
    }

      const dish_recipe = {
        "DishID": dishID,
        "SK": `RECIPE#${dishID}-${inputs['Servings']}-${inputs['Version']}`,
        "Additional Instructions": inputs["AdditionalInstructions"].split(','),
        "CookTime": inputs["CookTime"],
        "Developer": "Nosh",
        "ElecUnits": "-",
        "Ingredients": {
          "ExtraIngredients": [
          ],
          "Liquid": {
          "Oil": inputs["Oil"],
          "Water": inputs["Water"]
          },
          "Slots": finalSlots,
          "Spice": spices,
        },
        "Nutrition": {},
        "PrepTime": inputs["PrepTime"],
        "Quantity": "0",
        "Recipefile": `${dishID}/${dishID}-${inputs['Servings']}-${inputs['Version']}.recipe`,
        "RecipeID": `${dishID}-${inputs['Servings']}-${inputs['Version']}`,
        "Servings": inputs["Servings"],
        "ServingSize": "",
        "Version": inputs["Version"],
        "CookMoreInstructions": {
          "stove_heat": inputs["stove_heat"],
          "stove_command": inputs["stove_command"],
        }
      }

      finalRes['dish_info'] = dish_info;
      finalRes['dish_recipe'] = dish_recipe;
      // finalRes['dish_image'] = inputs['dish_image'];
      // finalRes['tray_image'] = inputs['tray_image'];
      finalRes['recipe_file'] = inputs['recipe_file'];
      
      console.log(finalRes);

      await fetch(`https://a5morsuyy6.execute-api.ap-south-1.amazonaws.com/dev/upload-recipe/${dishID}`,
      {
          method: "POST",
          body: JSON.stringify(finalRes)
      })
      .then(function(res){ return res.json(); })
      .then(function(data){ console.log( JSON.stringify( data ) ); alert(data["message"]) })

      // await fetch("https://a5morsuyy6.execute-api.ap-south-1.amazonaws.com/dev/dish-features",
      // {
      //     method: "PATCH",
      //     body: JSON.stringify(dishFeaturesData)
      // })
      // .then(function(res){ return res.json(); })
      // .then(function(data){ console.log( JSON.stringify( data ));})

      setFormSuccess(`Serving Added - ${state['Recipe']['DishID']}-${inputs['Servings']}-${inputs['Version']}`);
      // setSubmitting(false);
      // })
      handleReset();
      
    } catch (err) {
      handleErrors(err);
    }
  };

  const resetSelectUtil = (className) => {
    const elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
      elements[i].selectedIndex = 0;
    }
  }

  const handleErrors = (err) => {
    // if (err.response.data && err.response.data.errors) {
    //   // Handle validation errors
    //   const { errors } = err.response.data;

    //   let errorMsg = [];
    //   for (let error of errors) {
    //     const { msg } = error;

    //     errorMsg.push(msg);
    //   }

    //   setFormErrors(errorMsg);
    // } else {
    //   // Handle generic error
    //   setFormErrors(['Oops, there was an error!']);
    // }
    console.log(err);
  };


  function handleFileSelect(event) {
    let name = event.target.name;
    const reader = new FileReader()
    
    setFormErrors([]);
    setFormSuccess('');
    reader.onload = function handleFileLoad(e) {
      inputs[name] =  e.target.result;
      // if (name === 'dish_image'){
      //   setPreviewDish(inputs[name])
      // }
      // if (name === 'tray_image'){
      //   setPreviewTray(inputs[name])
      // }
    };
    reader.readAsDataURL(event.target.files[0])
  }

  const handleReset = () => {
    setInputs(FormConst.initialInputs);
      finalRes = {};

      FormConst.resetInputUtil('input-file');
      FormConst.resetInputUtil('input');
      FormConst.resetInputUtil('ingredientInput');
      resetSelectUtil('ingredientSelect');
      resetSelectUtil('inputSelect');
      const ele = document.getElementsByClassName('allergenbox');
      allergens = [];

      for (let i = 0; i < ele.length; i++) {
        ele[i].style.color = 'black';
        ele[i].style.backgroundColor = 'white';
      }

      setSpices(FormConst.initialSpices);
      updateSlots([{...FormConst.ingredientObj}]);
      document.getElementById(`id#0`).readOnly = false;
      document.getElementById(`Ingredient Type#0`).readOnly = false;
      document.getElementById(`Unit#0`).readOnly = false;
      document.getElementById(`Shopping Unit#0`).readOnly = false;
      document.getElementById(`Factor#0`).readOnly = false;
      document.getElementById(`Source#0`).readOnly = false;
  }

  return (
    <>
    <Layout/>
    <div className='container'>
      <form onSubmit={handleSubmit} className='form'>
        <AlertSuccess success={formSuccess} />
        <AlertError errors={formErrors} />
        <div className='dish-id'>{state['Info']['DishID']}</div>
        <Input 
          label="Dish Name" 
          name="DishName" 
          value={inputs["DishName"]} 
          change={handleChange}
        />

        <div>
          <label>Additional Instructions (E.g. Instruction 1, Instruction 2, Instruction 3,...)</label>
          <textarea
            name="AdditionalInstructions"
            value={inputs["AdditionalInstructions"]}
            onChange={handleChange}
            rows="4"
            style={{
              height: "auto", 
              lineHeight: "1.5",
              resize: 'none',
            }}
          ></textarea>
        </div>  

        <Input 
          label="Cook Time" 
          name="CookTime" 
          value={inputs["CookTime"]} 
          change={handleChange}
        />

        <Input 
          label="Prep Time" 
          name="PrepTime" 
          value={inputs["PrepTime"]} 
          change={handleChange}
        />

        <Input 
          label="Version" 
          name="Version" 
          value={inputs["Version"]} 
          change={handleChange}
        />

        <Input 
          label="Creator" 
          name="Creator" 
          value={inputs["Creator"]} 
          change={handleChange}
        />

        <Input 
          label="Oil" 
          name="Oil" 
          value={inputs["Oil"]} 
          change={handleChange}
        />
        
        <Input 
          label="Water" 
          name="Water" 
          value={inputs["Water"]} 
          change={handleChange}
        />

        <div>
          <label>Course</label><br/>
          <select
            name='Course'
            value={inputs['Course']}
            className='inputSelect'
            onChange={handleChange}
            required
          >
            {FormConst.courseOptions.map((name) => <option key={name}>{name}</option>)}
          </select>
        </div>
        <div>
          <label>Cuisine</label><br/>
          <select
            name='Cuisine'
            value={inputs['Cuisine']}
            className='inputSelect'
            onChange={handleChange}
            required
          >
            {FormConst.cuisineOptions.map((name) => <option key={name}>{name}</option>)}
          </select>
        </div>
        <div>
          <label>Dish Type</label><br/>
          <select
            name='Type'
            value={inputs['Type']}
            className='inputSelect'
            onChange={handleChange}
            required
          >
           {FormConst.dishTypeOptions.map((name) => <option key={name}>{name}</option>)}
          </select>

        </div>

        <div>
          <label>Consistency</label><br/>
          <select
            name="Consistency" 
            value={inputs["Consistency"]} 
            className='inputSelect'
            onChange={handleChange}
            required
          >
            {FormConst.consistencyOptions.map((name) => <option key={name}>{name}</option>)}
          </select>
        </div>

        <div>
          <label>Main Ingredient</label><br/>
          <select
            name="MainIngredient" 
            value={inputs["MainIngredient"]} 
            className='inputSelect'
            onChange={handleChange}
            required
          >
            {FormConst.ingredientsFamilyOptions.map((name) => <option key={name}>{name}</option>)}
          </select>
        </div>
        
        <div>
          <label>Flavor 1</label><br/>
          <select
            name="Flavor1" 
            value={inputs["Flavor1"]} 
            className='inputSelect'
            onChange={handleChange}
            required
          >
            {FormConst.flavorOptions.map((name) => <option key={name}>{name}</option>)}
          </select>
        </div>
        
        <div>
          <label>Flavor 2</label><br/>
          <select
            name="Flavor2" 
            value={inputs["Flavor2"]} 
            className='inputSelect'
            onChange={handleChange}
            required
          >
            {FormConst.flavorOptions.map((name) => <option key={name}>{name}</option>)}
          </select>
        </div>
        
        <div>
          <label>Servings</label><br/>
          <select
            name='Servings'
            value={inputs['Servings']}
            className='inputSelect'
            required
            onChange={handleChange}
          >
            <option></option>
            {servings.map((name) => <option>{name}</option>)}
          </select>
        </div>
        
        <div>
          <label>Ingredients</label><br/>
          {/* {slots.length > 0 ? ( */}
            <Ingredients slots={slots} updateSlots={updateSlots} />
          {/* ) : (
            <div>
              <Ingredients slots={[{ ...FormConst.ingredientObj }]} updateSlots={updateSlots} />
            </div>
          )} */}
        </div>

        
        <div>
          <label>Allergens</label>
          <div className='allergens'>
            {FormConst.allergensNames
            .map((name) => <Allergen name={name} onclick={handleAllergenBoxClick}/>)}
          </div>
        </div>


        <div>
          <label>Spices</label>
          <div className='spices'>
            {Object.keys(FormConst.initialSpices)
            .map((name, i) => <Spice name={name} value={spices[name]} onclick={handleSpiceQtyChange}/>)}
          </div>
        </div>

        <div className='file-input'>
          {/* <div className='image-preview'>
            <FileInput name="tray_image" label="Tray Image" required={false} onchange={handleFileSelect}/>
            {inputs['tray_image'] &&  <img src={previewTray} alt="tray"/> }
          </div>
          <div className='image-preview'>
            <FileInput name="dish_image" label="Dish Image" required={false} onchange={handleFileSelect}/>
            {inputs['dish_image'] &&  <img src={previewDish} alt="dish"/> }
          </div> */}
          <FileInput name="recipe_file" label="Recipe File" required={true} onchange={handleFileSelect}/>
        </div>
        
        <label>Cook More Instructions</label>
        <div className="ingredients">
          <div className="ingredientsRow">
            <div className="ingredientName">
              <select
                name='stove_heat'
                value={inputs['stove_heat']}
                className='ingredientInput'
                onChange={handleChange}
                defaultValue={4}
              >
                {[2, 3, 4, 5, 6, 7, 8].map((stove_heat) => (
                  <option key={stove_heat} value={stove_heat}>
                    {stove_heat}
                  </option>
                ))}
              </select>
            </div>
            <div className="ingredientName">
              <select
              name='stove_command'
              value={inputs['stove_command']}
              className='ingredientInput'
              onChange={handleChange}
              >
                {FormConst.stoveCommands.map((stove_command) => (
                  <option key={stove_command} value={stove_command}>
                    {stove_command}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className='btn'>
          <input type='button' className='reset-btn' value='Reset' onClick={handleReset} />
          {submitting?
            <input type='button' disabled className='submitting-btn' value='Submitting...' />:
            <input type='submit' className='submit-btn' value='Submit' />
          }
        </div>
      </form>
    </div>
    </>
  );
};

export default AddMoreServings;