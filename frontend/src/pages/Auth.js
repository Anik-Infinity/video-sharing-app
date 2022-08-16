import React, { useState } from "react";
import "../css/auth.css"
import { login } from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const Auth = () => {

	const navigate = useNavigate()

	const [email, setEmail] = useState("anik.kafi404@gmail.com")
	const [password, setPassword] = useState("1234")
	const [isNew, setIsNew] = useState(false)

	const handleAuth = async (e) => {
		e.preventDefault()
		const res = await login({
			"phone": "01835309795",
			"email": email,
			"password": password,
			"isChecked": 1
		})
		localStorage.setItem('user_data', JSON.stringify(res.data.payload.data))
		localStorage.setItem('token', JSON.stringify(`Bearer ${res.data.payload.data?.accessToken}`))
		localStorage.setItem('signed_in', JSON.stringify(true))
		navigate('/');
	}
	
	return (
		// <div className="auth-container">
		<div>
			<form >
			{<h1>{isNew ? "Register" : "Login"}</h1>}
				<label >
					Email: 
					<input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
				</label>
				<label for="password">
					Password: &nbsp;
					<input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				</label>
				<button onClick={(e) => handleAuth(e)}>{isNew ? "Register" : "Login"}</button>
				<a onClick={() => setIsNew(!isNew)}>{!isNew ? "Register" : "Login"}</a>
			</form>
		</div>
	);
}


export default Auth;