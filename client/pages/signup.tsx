import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Panel from "./components/Panel";
import { backend } from "./components/Constants";
import Uppy from '@uppy/core';
import Form from '@uppy/form';
import { DragDrop } from '@uppy/react';
import XHRUpload from '@uppy/xhr-upload';
import FormData from 'form-data';
import '@uppy/core/dist/style.css';
import { get } from "http";

export default function Signup() {
    const [formState, setFormState] = useState(null);
    let [error, setError] = useState(null);
    let [filename, setFilename] = useState('');
    let [needsVerify, setNeedsVerify] = useState(false);
    const [uppy, setUppy] = useState(null);

    useEffect(() => {
        function getUppy() {
            return new Uppy({
                restrictions: {
                      maxNumberOfFiles: 1,
                      allowedFileTypes: ['image/*', '.png', '.jpg', '.jpeg', '.gif']
                },
                autoProceed: true, 
            })
        }
        let fname;
        let uppyInstance = getUppy();
        setUppy(uppyInstance);

        uppyInstance.use(XHRUpload, {
            endpoint: `${backend}/upload-image`,
            fieldName: 'files',
            formData: true,
            headers: {},
        })
    
        uppyInstance.on('upload-success', (file, response) => {
            console.log('successful upload', file, response);
            console.log('filename', response.body["filename"])
            setFilename(response.body["filename"]);
            fname = response.body["filename"];
            uppyInstance.close();
            uppyInstance = getUppy();
            setUppy(uppyInstance);
            console.log('filename now', filename);
        });

        uppyInstance.on('file-added', (file) => {
            console.log('File added:', file);
            // Perform additional actions here after a file is added
          });

        uppyInstance.on('error', (error) => {
            console.error('Error:', error);
        });
    }, []);

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
        // fetch(`${backend}/signup`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(formState),
        // })
            let data = {
                ...formState,
                filename: filename,
            };
            console.log('data', data);
            fetch(`${backend}/signup`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            }
            )
            .then((res) => {
                if (![200, 201].includes(res.status)) throw Error(res.statusText)
                success = true
                return res.json()
            })
            .then((data) => {
                if (success) {
                    sessionStorage.setItem("user", JSON.stringify(data));
                    setNeedsVerify(true);
                }
                uppy.close();
                return data;
            })
            .catch(err => {
                /// set your error to state here
            });
    };
    
    return (
        <Panel title="Sign Up">
            <div>
                {!needsVerify ? (
                <div>
                    <div className="flex items-center justify-center">
                        <form id="signup" onSubmit={handleSubmit}>
                            <input type="hidden" name="filename" onChange={handleChange} value={filename} />
                            <div className="row">
                                <label>First Name</label>
                                <input type="text" name="firstName" onChange={handleChange} />
                                <label>Last Name</label>
                                <input type="text" name="lastName" onChange={handleChange} />
                            </div>
                            <div className="row">
                                <label>Email</label>
                                <input type="text" name="email" onChange={handleChange} />
                            </div>
                            <div className="row">
                                <label>Nickname</label>
                                <input type="text" name="nickname" onChange={handleChange} />
                            </div>

                            <div className="row">
                                <label>Username</label>
                                <input type="text" name="username" onChange={handleChange} />
                            </div>
                            <div className="row">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                {error ? (
                                    <div className="error">{error}</div>
                                ) : (
                                    <div>&nbsp;</div>
                                )}
                            </div>

                            <div className="row">
                                <label>Bio</label>
                                <textarea name="bio" onChange={handleChange} />
                            </div>
                            <div className="photo">
                                <label>Photo</label>
                            { uppy && 
                                <div className="drag-drop">
                                    <DragDrop uppy={uppy} />
                                </div>
                            }
                            </div>
                            <div className="flex items-center justify-center">
                                <button className="button change-hue">Sign Up</button>
                            </div>
                        </form>
                    </div>
                </div>
                ) : (
                <div className="needs-verify">
                    Check your email to verify your account!
                </div>
                )}
            </div>
        </Panel>
    );
}
