import React from 'react';
import Photo from './Photo';
import '../App.css';
const PhotoContainer = props => {
    
    const display = () => {
        const dishDetails = {};

        for (let i = 0; i < props.data.length; i++) {
            let dishId = props.data[i].DishID;
            let sk = props.data[i].SK;
            if (dishId in dishDetails) {
                dishDetails[dishId][sk] = props.data[i];
            } else {
                dishDetails[dishId] = {
                    [sk]: props.data[i]
                };
            }
        }
        
        const dishData =  Object.values(dishDetails);
        const sortedDishes = dishData
            .filter((dish) => Object.keys(dish).some((sk) => sk.includes('INFO')))
            .sort((dishA, dishB) => {
                const nameA = dishA[Object.keys(dishA).find((sk) => sk.includes('INFO'))].DishName.toLowerCase();
                const nameB = dishB[Object.keys(dishB).find((sk) => sk.includes('INFO'))].DishName.toLowerCase();

                const isPublishedA = dishA[Object.keys(dishA).find((sk) => sk.includes('INFO'))].isPublished;
                const isPublishedB = dishB[Object.keys(dishB).find((sk) => sk.includes('INFO'))].isPublished;

                if (isPublishedA && !isPublishedB) {
                    return -1;
                } else if (!isPublishedA && isPublishedB) {
                    return 1;
                } else {
                // If both are published or both are not published, sort by name.
                if (nameA < nameB) {
                    return -1;
                } else if (nameA > nameB) {
                    return 1;
                } else {
                    return 0;
                }
                }
            }
        );

        return sortedDishes.map((obj, index) => {
            const dish = [];
            const existingServings = [];
            const keys = Object.keys(obj);
            for (let i = 0; i < keys.length; i++) {
                if (keys[i].includes('INFO')) {
                    dish.push(obj[keys[i]]);
                    break;
                }
            }

            for (let i = 0; i < keys.length; i++) {
                if (keys[i].includes('RECIPE')) {
                    dish.push(obj[keys[i]]);
                    existingServings.push(obj[keys[i]]['Servings'])
                }
            }
            return <Photo key={index} dish={dish} existingServings={existingServings}/>
        })
    }

    return (
        <>
            <section className='photoContainer'>
                {display()}
            </section>
        </>
    );
}

export default PhotoContainer;