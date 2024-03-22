import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Panel from './components/Panel';
import { backend } from './components/Constants';

export default function Login() {
    const [formState, setFormState] = useState({ username: '', password: '' });
    let [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (event) => {
        setFormState({
            ...formState,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formState);
        let success = false;
        fetch(`${backend}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formState),
        })
        .then(res => {
            console.log(res);
            if (res.status === 200 || res.status === 201) {
                success = true;
            } else {
                setError("Invalid username or password");
            }
            return res.json();
        })
        .then((data) => {
            console.log("returned:");
            console.log(data);
            if (success) {
                sessionStorage.setItem("user", JSON.stringify(data.user));
                sessionStorage.setItem("store", JSON.stringify(data.store));
                sessionStorage.setItem("products", JSON.stringify(data.products));
                sessionStorage.setItem("music", JSON.stringify(data.music));
                sessionStorage.setItem("tracks", JSON.stringify(data.tracks));
                sessionStorage.setItem("followers", JSON.stringify(data.followers));
                sessionStorage.setItem("following", JSON.stringify(data.following));
                console.log(sessionStorage);
                router.push("/user");
            }
            return data;
        })
};

    return (
        <Panel title="Login">
            <div className="flex items-center justify-center">
            <form onSubmit={handleSubmit} autocomplete="off">
                <div className="row">
                    <label>Username</label>
                    <input className="input" type="text" name="username" onChange={handleChange} />
                </div>
                <div className="row">
                    <label>Password</label>
                    <input className="input" type="password" name="password" onChange={handleChange} />
                </div>
                <div className="row">
                    {error ? <div className="error">{error}</div> : <div>&nbsp;</div>}
                </div>
                <div className="flex items-center justify-center">
                <button className="button button-small change-hue">Submit</button>
                </div>
            </form>
            </div>
        </Panel>
    );
}
