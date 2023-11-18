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

  return (
    <ul>
      <li>
        <NavLink exact to="/">Home</NavLink>
      </li>
      {isLoaded && <>
        {sessionUser &&<li>
          <button onClick={()=>history.push('/spots/new')}>Create a New Spot</button>
        </li>}
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      </>}
    </ul>
  );
}

export default Navigation;