const FileInput = (props) => {
    return <div>
    <label>{props.label}</label><br/>
    <input
    type='file'
    name={props.name}
    className='input-file'
    required={props.required}
    onChange={props.onchange}
    />
    </div>
}

export default FileInput;