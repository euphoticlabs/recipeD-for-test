import React from 'react';
import { useEffect, useState } from 'react';
// import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './Modal.css'

const Modal =  props => {

    const [inputs, setInputs] = useState({...props.data, ...props.recipe});

    const closeOnEscapeKeyDown = (e) => {
        if ((e.charCode || e.keyCode) === 27) {
            props.onClose();
        }
    }

    useEffect(()=> {
        document.body.addEventListener('keydown', closeOnEscapeKeyDown)
        return function cleanup() {
            document.body.removeEventListener('keydown', closeOnEscapeKeyDown)
        }
    }, []);

    // if (!props.show) {
    //     return null;
    // }
    const handleInput = (e) => {
        setInputs(values => ({
            ...values,
            [e.target.name]: e.target.value
        }))
    }
    const infoKeys = Object.keys(props.data);
    const recipeKeys = Object.keys(props.recipe);
    const infoInputs = infoKeys.map((key) => {
        // if (key !== 'DishID' || key !== 'SK') 
        return (<div className='input' key={key}>
            <label>{key}</label>
            <input type='text' name={key} defaultValue={props.data[key]} onChange={handleInput}/>
        </div>)
    });

    const recipeInputs = recipeKeys.map((key) => {
        // if (key !== 'DishID' || key !== 'SK') 
        if (!(key in props.data))
        return (<div className='input' key={key}>
            <label>{key}</label>
            <input type='text' name={key} defaultValue={props.recipe[key]} onChange={handleInput}/>
        </div>)
        return null;
    });
    const handleSubmit = () => {
        console.log(inputs);
    }

    console.log(props.recipe)

    return (
        <CSSTransition
            in={props.show}
            unmountOnExit
            timeout={{ enter: 0, exit: 300 }}
        >
        <div className='modal' onClick={props.onClose}>
            <div className='modal-content' onClick={e => e.stopPropagation()}>
                <div className='modal-header'>
                    <h4 className='modal-title'>
                        {props.data.DishName}
                    </h4>
                </div>
                <div className='modal-body'>
                    <form className='modal-form'>
                        {
                            infoInputs
                        }
                        {
                            recipeInputs
                        }
                        <br/>
                        <button type='button' onClick={handleSubmit}>Submit</button>
                    </form>
                </div>
                <div className='modal-footer'>
                    <button className='button' onClick={props.onClose}>Close</button>
                </div>
            </div>
        </div>
        </CSSTransition>
    );
}

export default Modal;