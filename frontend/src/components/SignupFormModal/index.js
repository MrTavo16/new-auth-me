import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [empty, setEmpty] = useState(false)
  const [submited, setSubmited] = useState(false)
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    const currErrors = {}
    if (!email.length && !username.length && !firstName.length && !lastName.length && !password.length && !confirmPassword.length) setEmpty(true)
    else setEmpty(false)
    if (submited) {
      if (!email.length) {
        currErrors.email = 'Email is required'
      }
      // console.log(submited)
      if (!username.length || username.length < 4) {
        currErrors.username = 'Username is required and must be more than 4 characters'
      }
      if (!firstName.length) {
        currErrors.firstName = 'First name is required'
      }
      if (!lastName.length) {
        currErrors.lastName = 'Last name is required'
      }
      if (!password.length || password.length < 6) {
        currErrors.password = 'Password is required and must be more than 6 characters'
      }
      if (!confirmPassword.length) {
        currErrors.confirmPassword = 'Confirm password is required'
      }
    }
    setErrors(currErrors)
  }, [email, username, firstName, lastName, password, confirmPassword])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setSubmited(true)
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(() => {
        })
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className="signup-all">
      <h1>Sign Up</h1>
      <form className="signup-all" onSubmit={handleSubmit}>
        <div className="text-box">
        <input
          type="text"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {errors.email && <p>{errors.email}</p>}

        <div className="text-box">
        <input
          type="text"
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {errors.username && <p>{errors.username}</p>}
        <div className="text-box">
        <input
          type="text"
          value={firstName}
          placeholder='First Name'
          onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        {errors.firstName && <p>{errors.firstName}</p>}
        <div className="text-box">
        <input
          type="text"
          value={lastName}
          placeholder='Last Name'
          onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        {errors.lastName && <p>{errors.lastName}</p>}
        <div className="text-box">
        <input
          type="password"
          value={password}
          placeholder='Password'
          onChange={(e) => setPassword(e.target.value)}
          />
          </div>

        {errors.password && <p>{errors.password}</p>}
        <div className="text-box">
        <input
          type="password"
          value={confirmPassword}
          placeholder='Confirm Password'
          onChange={(e) => setConfirmPassword(e.target.value)}
          />
          </div>

        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <div className="submit-button">
        <button className="button"disabled={Object.values(errors).length || empty} type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  );
}

export default SignupFormModal;