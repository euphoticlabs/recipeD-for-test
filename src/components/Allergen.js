
const Allergen = (props) => {
    return <div 
    className='allergenbox' 
    id={`allergen#${props.name}`} 
    onClick={props.onclick}
  >
{props.name}
</div>
}

export default Allergen;