import { authService, firebaseInstance } from 'fbase';
import React, {useState} from 'react';

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onChange = (event) => {
        const {target: {name, value}} = event;
        if(name === "email") {
            setEmail(value);
        } else if(name === "password") {
            setPassword(value);
        }
    }

    const onSubmit = async(event) => {
        event.preventDefault();
        try {
            await authService.signInWithEmailAndPassword(email, password);
        }catch(e){
            setError(e.message);
        }
    }

    const onSocialClick = async(event) => {
        await authService.signInWithPopup(new firebaseInstance.auth.GoogleAuthProvider());
    }

    return (
        <div>
        <div>
            <h1>Welcome!</h1>
            <p>You need to sign in to use Kassaboken.</p>       
            </div>
        <div> 
            <form onSubmit = {onSubmit}>
                <input 
                    name = "email"
                    type = "text"
                    placeholder = "Email"
                    required 
                    value = {email}
                    onChange = {onChange}/>
                <input 
                    name = "password"
                    type = "password"
                    placeholder = "Password"
                    required 
                    value = {password}
                    onChange = {onChange}/>
                <input type = "submit" value ="Sign in" />
            </form>
        </div>
        <div>
            <button name="google" onClick = {onSocialClick}>Log in with Google account</button>
            <br />
            <button name = "create">Create new account</button>
            <br />
            <p>{error}</p>
        </div>
        </div>
    );
}

export default Auth;