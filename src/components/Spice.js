const Spice =  (props) => {

    return <div className='spicesRow'>
      <div className='spiceColumn'>
        <label>{props.name}</label>
      </div>

      <div className='spiceColumn'>
        <div className='box'>
          <div className='spiceQty'>

            <button type='button' name={props.name} value="+" onClick={props.onclick}>+</button>

            <p id={`${props.name}`}>{props.value}</p>

            <button type='button' name={props.name} value="-" onClick={props.onclick}>-</button>
          </div>
        </div>
      </div>
      </div>
}

export default Spice;