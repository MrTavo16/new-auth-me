import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useHistory } from "react-router-dom"
import OpenModalButton from "../OpenModalButton";
import './Navigation.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory()

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout())
      .then(()=>{
        history.push('/')
      });
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={openMenu}>
        <i className="fas fa-user-circle fa-2x" />
      </button>
      <div className={ulClassName} ref={ulRef}>
        {showMenu && <>
        {user ? (
          <div>
            <div>Hello, {user.firstName}</div>
            <div>{user.email}</div>
            <div className="divider"></div>
            <div>
              <button style={{
                "marginTop":"2px",
               }} onClick={()=>history.push('/spots/current')}>Manage Spots</button>
            <div style={{"marginTop":"2px"}} className="divider"></div>
            </div>
            <div>
              <button style={{
                "backgroundColor":"gray",
                "color":"white"
              }} onClick={logout}>Log Out</button>
            </div>
          </div>
        ) : (
          <>
            <OpenModalButton
              buttonText="Log In"
              onButtonClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalButton
              buttonText="Sign Up"
              onButtonClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
        </>}
      </div>
    </>
  );
}

export default ProfileButton;