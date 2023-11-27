import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from 'react-router-dom'
import "./LoginForm.css";

function LoginFormModal() {
  const history = useHistory()
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [subOn, setSubOn] = useState(true)
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(()=>{
    if(credential.length > 4)setSubOn(false)
    else setSubOn(true)

    if(password.length > 6) setSubOn(false)
    else setSubOn(true)
  },[password, credential])

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(()=>{
        history.push('/')       
      })
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors({message:'The provided credentials were invalid'});
        }
      });
  };

  const handleDemoUser = (e)=>{
    // e.preventDefault();
    setCredential('Demo-lition')
    setPassword('password')
    setErrors({});
    return dispatch(sessionActions.login({ 
      "credential":"Demo-lition"
    , "password":"password"
    }))
      .then(()=>{
        history.push('/')
      })
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors({message:'The provided credentials were invalid'});
        }
      });
  }
  // console.log(errors)
  return (
    <div className="login-all">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
          {errors.message && (
            <p className="errors">{errors.message}</p>
            )}
        <div className="text-box-log">
          <input
            type="text"
            placeholder="Username or Email"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            />
        </div>
  
        <div className="text-box-log">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="submit-button-log">
        <button disabled={subOn} className="button-log" type="submit">Log In</button>
        </div>

        <div id="demo" onClick={handleDemoUser}>Log in as Demo User</div>
      </form>
    </div>
  );
}

export default LoginFormModal;