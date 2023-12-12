import React, { useState } from 'react';
// import Modal from './Modal';
// import { useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
const Photo = ({dish, existingServings}) => {
    // const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const [EditServingsFlag, setEditServingsFlag ] = useState(false);
    const baseUrl = 'https://amplify-noshapp-dev-124225-deployment.s3.ap-south-1.amazonaws.com/';
    const [servingsArray, setServingsArray] = useState();
    const handleEdit = () =>{
        console.log(dish);
        setServingsArray(dish.map(item=> item.Servings !== undefined? item.Servings : null));
        setEditServingsFlag(true);
    }

    const handleClick = (event) => {
        let val = event.target.innerText;
        // console.log(event)
        val = val.split(' ')[1];
        let recipe = dish.filter(item=> item.Servings === val);
        navigate('/test', {state: {'Info': dish[0], 'Recipe': recipe[0]}});
    }
    const handleAddMoreServings = () =>{
        navigate('/add-more-servings', {state: {'Info': dish[0], 'Recipe': dish[1], 'ExistingServings': existingServings}})
    }
    

    const [publishDish, setPublishDish] = useState(dish[0]?.isPublished, false)
    const handlePublishDish = () => {
        if (dish[0].DishID) {
            const alert_message = dish[0].isPublished 
                ? "Are you sure you want to unpublish this dish?"
                : "Are you sure you want to publish this dish?"; 
            if(window.confirm(alert_message)){
                const updated_cooking = {
                    ...dish[0],
                    isPublished: !publishDish
                }
                console.log(updated_cooking)
                
                fetch(`https://a5morsuyy6.execute-api.ap-south-1.amazonaws.com/dev/dish`, {
                    method: "PATCH",
                    body: JSON.stringify(updated_cooking)
                })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    setPublishDish(updated_cooking.isPublished);
                })
                .catch((error) => {
                    console.error(error);
                });

                let DishID = dish[0].DishID
                fetch(`https://a5morsuyy6.execute-api.ap-south-1.amazonaws.com/dev/dish-features/dishID?DishID=${DishID}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    const updatedData = {
                        ...data,
                        isPublished: !publishDish,
                    };

                    fetch(`https://a5morsuyy6.execute-api.ap-south-1.amazonaws.com/dev/dish-features`, {
                        method: "PATCH",
                        body: JSON.stringify(updatedData),
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                    })
                    .catch((secondError) => {
                        console.error(secondError);
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
            }
        }
        else
            console.log("Error occurred, dish is : " + dish.toString())
    }

    const [isCopied, setIsCopied] = useState(false);
    const copyToClipboard = () => {
        const tempInput = document.createElement('input');   // Create a temporary element (input) to hold the value
        tempInput.value = dish[0].DishID;
        document.body.appendChild(tempInput);      // Append the input to the document    

        tempInput.select();       // Select and copy the value
        document.execCommand('copy');
        setIsCopied(true);

        document.body.removeChild(tempInput);    // Remove the temporary input

        setTimeout(() => {
            setIsCopied(false);
          }, 2000);
      };

    return (
        <>
            {(dish[0] !== undefined && dish[0]['DishImage'] !== undefined)? 
                <>
                    <div className='photo'>
                        <img src={baseUrl+dish[0].DishImage} alt={dish[0].DishName}/>
                        <p className='photoNameAndId'>
                            {dish[0].DishName} 
                            <br />
                            {dish[0].DishID}
                            <span onClick={copyToClipboard} style={{ cursor: 'pointer', marginLeft:10 }}>
                                {!isCopied ? ' 📋' : '✔️'}
                            </span>
                        </p>
                        <div className='recipe-btn'>
                            {/* <button id="add-serving-btn" onClick={() => setShow(true)}>Add Serving</button> */}
                            <button id="add-serving-btn" onClick={handleAddMoreServings}>Add Serving</button>
                            
                            {!publishDish && <button id="publish" onClick={handlePublishDish}>Publish</button>}
                            {publishDish && <button id="publish" onClick={handlePublishDish} style={{backgroundColor: 'green'}}>Published</button>}
                            <button onClick={handleEdit}>Edit</button>

                            {EditServingsFlag && servingsArray.length>0? <div className='editServingsDropdown'>
                                {servingsArray.map((serving, i) => serving? <p className='servingSize' key={i} onClick={handleClick}>{`Serving ${serving}`}</p>: null)}
                            </div> : null}
                        </div>
                    </div>
                    {/* <Modal onClose={() => setShow(false)} show={show} data={dish[0]} recipe = {dish[1]}/> */}
                </>
            : <></>}
        </>
    );
}

export default Photo;