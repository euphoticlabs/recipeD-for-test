import '../App.css'

const Layout = () => {
    return (
        <>
            <div className='logo'>
          <picture>
            <img src='https://amplify-noshapp-dev-124225-deployment.s3.ap-south-1.amazonaws.com/Test/nosh-logo.webp' alt='nosh logo'></img>
            <span style={{fontSize: '17px' ,fontWeight: 'bold', color:'#ff5827', marginLeft:10}}> 1.2.0</span>
          </picture>
        </div>
    <div className='parent'>
    <div className='navbar'>
      <nav>
        <div className='menu'>
          <ul>
            <li><a href="/">Home</a>
            </li>
            <li><a href="upload">Create Recipe</a>
            </li>
            {/* <li><a href="#contact">Contact</a>
            </li> */}
          </ul>
        </div>
      </nav>
    </div>
    </div>
        </>
    );
}

export default Layout;
