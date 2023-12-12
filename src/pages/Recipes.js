import React from 'react';
import { useEffect, useState } from 'react';
import PhotoContainer from './PhotoContainer';
import Layout from './Layout';
const Recipes = () => {
    const [data, setData] = useState([]);
    const fetchData = () => {
        fetch('https://a5morsuyy6.execute-api.ap-south-1.amazonaws.com/dev/all-chef-dishes')
        .then(res => res.json())
        .then(res => {
            setData(res);
        })
        // setData(res);
    }

    useEffect(()=> {fetchData()}, []);

    return (
        <>
            <Layout/>
            <PhotoContainer data={data}/>
        </>
    )
}

export default Recipes;