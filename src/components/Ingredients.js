import React, { useState , useEffect} from "react";
import * as FormConst from "../data/FormConst"

const THROTTLE_DELAY = 1000;
let searchResults = [{}];

const Ingredients = ({slots, updateSlots}) => {

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    updateSlots(prev => {
      prev[index][name] = value;
      if (name === "Unit"){
        prev[index]["Factor"] = parseFloat(searchResults[index][value]) / parseFloat(searchResults[index][prev[index]["Shopping unit"]]);
        prev[index]["Factor"] = prev[index]["Factor"].toFixed(2);
      }
      else if (name === "Shopping unit"){
        prev[index]["Factor"] = parseFloat(searchResults[index][prev[index]["Unit"]]) / parseFloat(searchResults[index][value]);
        prev[index]["Factor"] = prev[index]["Factor"].toFixed(2);
      }

      if (isNaN(prev[index]["Factor"])) {
        console.log(`Factor is NaN for ${prev[index]['Ingredient']}` )
      }
      //   setFormErrors((prevErrors) => [...prevErrors, `Factor is NaN at slot ${index}`]);
      // } 
      // else {
      //   setErrors((prevErrors) => prevErrors.filter((error) => !error.includes(`slot ${index}`)));
      //   prev[index]["Factor"] = factorValue.toFixed(2);
      // }

      return [...prev];
    });
  }


  const handleRemove = (index) => {
    updateSlots(prev => {
        if (prev.length>1)
        return prev.filter((val, i) => i!==index)
        return [...prev];
    });
    setSuggestions(prev => prev.filter((val, i)=> i!==index));
    searchResults = searchResults.filter((val, i)=> i!==index);
  }

  const handleAdd = (index) => {
    setSuggestions(prev => [...prev, []]);
    searchResults.push({});
    updateSlots(prev => {
      prev.splice(index, 0, {...FormConst.ingredientObj});
      return [...prev]}
    );
  }

  const handleMarkOptional = (index) => {
    updateSlots((prev) => {
      if (!prev[index].hasOwnProperty('optional')) {
        prev[index].optional = true;
      } else {
        prev[index].optional = !prev[index].optional;
      }
      console.log(slots);
      return [...prev];
    });
  };
  
  const handleMarinationIngredient = (index) => {
    updateSlots((prev) => {
      if (!prev[index].hasOwnProperty('marinationIngredient')) {
        prev[index].marinationIngredient = true;
      } else {
        prev[index].marinationIngredient = !prev[index].marinationIngredient;
      }
      console.log(slots);
      return [...prev];
    });
  };

  const debounce = (callback, delay = THROTTLE_DELAY) => {
    var time;
    return (...args) => {
      clearTimeout(time);
      time = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }
  
  const [suggestions, setSuggestions] = useState([[]]);

  const searchIngredient = debounce((i, event) => {
    const name = event.target.value.toLowerCase().trim();
    if (name !== "") {
      fetch(`https://a5morsuyy6.execute-api.ap-south-1.amazonaws.com/dev/search-ingredient?name=${name}`)
      .then((data) => data.json())
      .then((res) => {
        // console.log(res)        
        const search_res = res.map(search => <p onClick={() => {
          Object.keys(search).map((key) => search[key] = search[key].charAt(0).toUpperCase() + search[key].slice(1))
          
          console.log(search)
          updateSlots(prev => {
            prev[i]['Ingredient'] = search['name'];
            prev[i]['id'] =  search['id'];
            prev[i]['Ingredient Type'] =  search['Ingredient Type'];
            prev[i]['Unit'] =  search['Display Unit'];
            prev[i]['Shopping unit'] =  search['Shopping Unit'];
            prev[i]['Factor'] = search['factor'];
            prev[i]['Source'] = search['Brand'];
            return [...prev];
          })

          document.getElementById(`id#${i}`).readOnly = true;
          document.getElementById(`Ingredient Type#${i}`).readOnly = true;
          document.getElementById(`Unit#${i}`).readOnly = true;
          document.getElementById(`Shopping Unit#${i}`).readOnly = true;
          document.getElementById(`Factor#${i}`).readOnly = true;
          document.getElementById(`Source#${i}`).readOnly = true;

          setSuggestions(prev => {
            prev[i] = [];
            return [...prev];
          });
          
          searchResults[i] = search;

        }}>{search.name.charAt(0).toUpperCase() + search.name.slice(1)}</p>);

        setSuggestions(prev => {
            prev[i] = search_res
            return [...prev];
        });
        
      })
    }
    else {
      setSuggestions([[]])
    }
  });

  
  const [hasLoaded, setHasLoaded] = useState(false);

  const searchIngredientsOnLoad = async () => {
    // Check if slots is defined
    if (slots && slots.length > 0) {
      const promises = slots.map(async (obj, i) => {
        const name = obj["Ingredient"].toLowerCase().trim();

        if (name !== "") {
          try {
            const res = await fetch(
              `https://a5morsuyy6.execute-api.ap-south-1.amazonaws.com/dev/search-ingredient?name=${name}`
            );
            const data = await res.json();

            console.log("Search Results for", name, ":", data);

            if (data.length > 0) {
              const search = data[0];

              updateSlots(prev => {
                prev[i]['Ingredient'] = search['name'];
                prev[i]['id'] =  search['id'];
                prev[i]['Ingredient Type'] =  search['Ingredient Type'];
                prev[i]['Unit'] =  search['Display Unit'];
                prev[i]['Shopping unit'] =  search['Shopping Unit'];
                prev[i]['Factor'] = search['factor'];
                prev[i]['Source'] = search['Brand'];
                return [...prev];
              });

              document.getElementById(`id#${i}`).readOnly = true;
              document.getElementById(`Ingredient Type#${i}`).readOnly = true;
              document.getElementById(`Unit#${i}`).readOnly = true;
              document.getElementById(`Shopping Unit#${i}`).readOnly = true;
              document.getElementById(`Factor#${i}`).readOnly = true;
              document.getElementById(`Source#${i}`).readOnly = true;

              searchResults[i] = search;
            }
          } catch (error) {
            console.error("Error fetching data for", name, ":", error);
          }
        }
      });

      await Promise.all(promises);
      console.log("Search completed");
      setHasLoaded(true);
    } else {
      console.error("Error: Slots is undefined.");
    }
  };

  useEffect(() => {
    if (!hasLoaded) {
      console.log("useEffect triggered");
      searchIngredientsOnLoad();
    }
  }, [hasLoaded, slots]);

  const calculateFraction = (quantity, unit, factor, shopUnit) => {
    let alternate_qty = quantity / factor;
    let intPart = Math.floor(alternate_qty);
    let decimalPart = alternate_qty - intPart;
    let roundedDecimal = Math.round(decimalPart * 4) / 4;

    if (roundedDecimal >= 1) {
      intPart += 1;
    }

    if (intPart === 0 && roundedDecimal === 0.0) {
      return "";
    }

    if (shopUnit === unit) {
      return "";
    }

    let fraction = "";
    if (roundedDecimal > 0) {
      switch (roundedDecimal) {
        case 0.25:
          fraction = "¼";
          break;
        case 0.5:
          fraction = "½";
          break;
        case 0.75:
          fraction = "¾";
          break;
        default:
          break;
      }
    }

    let unitText = unit || "";
    unitText = unitText.toLowerCase();

    if (unitText.toLowerCase() === "unit") {
      unitText = alternate_qty > 1 ? "nos." : "no.";
    }

    if (fraction !== "") {
      return `${intPart > 0 ? `${intPart}${fraction}` : fraction} ${unitText}`;
    } else {
      return `${intPart} ${unitText}`;
    }
  };


  return (
    <>
      {slots.map((obj, i) => (
        <div className="ingredients" key={i} id={i}>
          <div className="markButtons">
            <button
              type="button"
              className={`markButton ${obj.optional ? "active" : ""}`}
              onClick={() => handleMarkOptional(i)}
            >
              Mark as Optional
            </button>

            <button
              type="button"
              className={`markButton ${obj.marinationIngredient ? "active" : ""}`}
              onClick={() => handleMarinationIngredient(i)}
            >
              Marination Ingredient
            </button>
          </div>

          <div className="ingredientsRow">
            <div className="ingredientSlot">
              <label>Slot</label>

              <select
                className="ingredientSelect"
                name="Slot"
                value={obj["Slot"]}
                key={`slot#${i}`}
                onChange={(event) => handleChange(i, event)}
                required
              >
                <option value="">Select Slot</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            <div className="ingredientName">
              <div>
                <label>Ingredient</label>
                <input
                  type="text"
                  name="Ingredient"
                  value={obj["Ingredient"]}
                  className="ingredientInput"
                  id={`Ingredient#${i}`}
                  key={`Ingredient#${i}`}
                  required
                  onChange={(event) => handleChange(i, event)}
                  onKeyUp={(event) => searchIngredient(i, event)}
                />
              </div>
              {i < suggestions.length ? (
                suggestions[i] !== undefined && suggestions[i].length > 0 ? (
                  <div className="ing_suggestions">{suggestions[i]}</div>
                ) : (
                  <div></div>
                )
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className="ingredientsRow">
            <div className="ingredientName">
              <label>ID</label>
              <input
                type="text"
                name="id"
                value={obj["id"]}
                key={`id#${i}`}
                id={`id#${i}`}
                required
                onChange={(event) => handleChange(i, event)}
                className="ingredientInput"
              />
            </div>
            <div className="ingredientSlot">
              <label>Chopping Style</label>
              <select
                type="text"
                name="Chopping Style"
                value={obj["Chopping Style"]}
                key={`Chopping Style#${i}`}
                className="ingredientSelect"
                onChange={(event) => handleChange(i, event)}
              >
                <option value="">Select Chopping</option>
                {FormConst.choppingStyles.map((val) => (
                  <option value={val}>{val}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="ingredientsRow">
            <div className="ingredientName">
              <label>Factor</label>
              <input
                type="text"
                name="Factor"
                value={obj["Factor"]}
                key={`Factor#${i}`}
                id={`Factor#${i}`}
                required
                pattern="\d+(\.\d{1,2})?"
                title="Please enter a valid number"
                onChange={(event) => handleChange(i, event)}
                className="ingredientInput"
              />
            </div>

            <div className="ingredientName">
              <label>Ingredient Type</label>
              <input
                type="text"
                name="Ingredient Type"
                value={obj["Ingredient Type"]}
                key={`Ingredient Type#${i}`}
                id={`Ingredient Type#${i}`}
                required
                onChange={(event) => handleChange(i, event)}
                className="ingredientInput"
              />
            </div>
          </div>

          <div className="ingredientsRow">
            <div className="ingredientName">
              <label>Quantity</label>
              <input
                type="text" 
                name="Quantity"
                value={obj["Quantity"]}
                key={`Quantity#${i}`}
                required
                onChange={(event) => handleChange(i, event)}
                className="ingredientInput"
              />
            </div>
            
            <div className="ingredientName">
              <label>Shopping Unit</label>
              <select
                // type='text'
                name="Shopping unit"
                value={obj["Shopping unit"].toLowerCase()}
                key={`Shopping Unit#${i}`}
                id={`Shopping Unit#${i}`}
                onChange={(event) => handleChange(i, event)}
                // required
                className="ingredientInput"
              >
                <option></option>
                {FormConst.ingredientUnits.map((unit) =>
                  searchResults[i] !== undefined &&
                  searchResults[i][unit] !== undefined &&
                  searchResults[i][unit].trim() !== "" &&
                  parseFloat(searchResults[i][unit]) > 0 ? (
                    <option>{unit}</option>
                  ) : null
                )}
              </select>
            </div>
          </div>

          <div className="ingredientsRow">
            <div className="ingredientName">
              <label>Display Unit</label>
              <select
                // type='text'
                name="Unit"
                value={obj["Unit"].toLowerCase()}
                key={`Unit#${i}`}
                id={`Unit#${i}`}
                // required
                onChange={(event) => handleChange(i, event)}
                className="ingredientInput"
              >
                <option></option>
                {FormConst.ingredientUnits.map((unit) =>
                  searchResults[i] !== undefined &&
                  searchResults[i][unit] !== undefined &&
                  searchResults[i][unit].trim() !== "" &&
                  parseFloat(searchResults[i][unit]) > 0 ? (
                    <option>{unit}</option>
                  ) : null
                )}
              </select>
            </div>

            <div className="ingredientName">
              <label>Source</label>
              <input
                type="text"
                name="Source"
                value={obj["Source"]}
                key={`Source#${i}`}
                id={`Source#${i}`}
                onChange={(event) => handleChange(i, event)}
                className="ingredientInput"
              />
            </div>
          </div>

          {/* <div className="previewRow">
            <div className="previewBox">
              {`${obj["Factor"] !== "" ? calculateFraction(obj["Quantity"], obj["Unit"], parseFloat(obj["Factor"]), obj["Shopping unit"]) : ""}`}
            </div>
          </div> */}

          <div className="ingredientsRow">
            <div className="ingredientButtons">
              <input type="button" value="-" onClick={() => handleRemove(i)} />
              <input type="button" value="+" onClick={() => handleAdd(i + 1)} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Ingredients;
