import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import CreateSpotForm from '../CreateSpotForm';
import OpenModalMenuItem from './OpenModalMenuItem';
import './Navigation.css';
{/* <CreateSpotForm/> */}
function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const history = useHistory()

  return (<>
    <div className='navbar'>
      <div style={{color: '#ff1100', height:''}} onClick={()=> history.push('/')}>
        <div className="fa-brands fa-airbnb fa-3x" style={{color: '#ff1100'}}>
        </div>
        <i style={{fontSize:'40px'}}>
        airbnb
        </i>
      </div>
      
      {isLoaded && <div className='create-user'>
        {sessionUser &&<div className='create-spot'>
          <button className="create-button" onClick={()=>history.push('/spots/new')}>Create a New Spot</button>
        </div>}
        <i className='user-menu'>
          <ProfileButton user={sessionUser} />
        </i>
      </div>}
    </div>
    <span className='divider'>
    </span>
  </>);
}

export default Navigation;