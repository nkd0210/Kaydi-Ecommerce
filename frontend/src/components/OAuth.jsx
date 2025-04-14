import React from 'react'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from 'react-router-dom';

const OAuth = () => {

    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClickGoogle = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' }); // when click the continue with google , it will always ask to choose which account
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: resultsFromGoogle.user.email,
                    name: resultsFromGoogle.user.displayName,
                    photo: resultsFromGoogle.user.photoURL
                }),
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                dispatch(signInSuccess(data));
                navigate('/');
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div onClick={handleClickGoogle}>
            Signin with Google
        </div>
    )
}

export default OAuth