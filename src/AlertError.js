const AlertError = ({ errors }) => {
    if (errors.length === 0) {
      return <></>;
    }
  
    return (
      <ul className='error'>
        {errors.map((error) => (
          <li>{error}</li>
        ))}
      </ul>
    );
  };

  export default AlertError;