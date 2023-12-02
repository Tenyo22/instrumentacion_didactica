'use client'

import React, { useEffect, useState } from 'react'
import './login.css'
import { login } from '../js/auth/login'


const Login = () => {
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')

    const HandleSubmit = async(e) => {
        e.preventDefault()

        await login({ user, password })
    }

    return (
        <div className="login d-flex flex-column align-items-center justify-content-center vh-100 text-center">

            <form onSubmit={HandleSubmit} className='container background-login rounded bg-primary col-lg-6 col-md-8 col-11 shadow d-flex flex-column justify-content-center align-items-center p-4 '>
                <img src='/logo_isic.png' alt='Logo ISIC' className='logo-isic mt-2 mb-5 shadow rounded p-1' />

                <div className='container inputs col-lg-10'>
                    <div className="input-group input-group-lg mb-3">
                        <span className="input-group-text" id="inputGroup-sizing-lg">Usuario:</span>
                        <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg"
                            onChange={(e) => setUser(e.target.value)} required />
                    </div>
                    <div className="input-group input-group-lg mb-3 ">
                        <span className="input-group-text" id="inputGroup-sizing-lg">Password:</span>
                        <input type="password" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg"
                            onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                </div>

                <button type='submit' className='btn btn-light btn-lg col-6'>Ingresar</button>
            </form>


        </div>
    )
}

export default Login