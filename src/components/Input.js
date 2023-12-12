
const Input = (props) => {
    return <div>
    <label>{props.label}</label><br/>
    <input
      type="text"
      name={props.name}
      value={props.value}
      className='input'
      required
      onChange={props.change}
    />
  </div>
}

export default Input;