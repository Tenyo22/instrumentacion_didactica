'use client'

import Navbar from '@/app/components/Navbar'
import { user, validateToken, validateTokenAPI } from '@/app/js/auth/token'
import { InsertUser, TablaUsuarios, getRol, getUsuarios, validateData } from '@/app/js/jefedivision/usuarios'
import React, { useEffect, useState } from 'react'
import './usuarios.css'
import { getPeriodo } from '@/app/js/jefedivision/periodo'

const Usuario = () => {

    const [form, setForm] = useState({
        usuario: '',
        password: '',
        rol: '0'
    })
    const [rol, setRol] = useState([])
    const [completed, setCompleted] = useState(false)
    const [usuario, setUsuario] = useState("")
    const [periodo, setPeriodo] = useState("")

    const fetchUsuarios = async () => {
        setCompleted(false)
        await getUsuarios()
        setCompleted(true)
    }

    useEffect(() => {
        const fetchData = async () => {
            validateToken()
            await validateTokenAPI()
            await getRol(setRol)
            
            const {periodoActual} = await getPeriodo()
            user(setUsuario)

            setPeriodo(periodoActual)
        }
        fetchData()
        fetchUsuarios()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value.trim()
        }))
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        if (validateData(form)) {
            await InsertUser(form)
            setCompleted(false)
            fetchUsuarios()
        }
    }

    return (
        <>
            <Navbar home={"/jefedivision"} periodo={periodo ? periodo.year : ''} usuario={usuario} />

            <section className='m-5 mt-5'>
                <section className='container row'>

                    <section className='col-6 d-flex flex-column align-items-center mt-4'>
                        <form onSubmit={handleFormSubmit} className='col-10 d-flex flex-column'>
                            <div className="input-group input-group-lg mb-3">
                                <span className="input-group-text" id="inputGroup-sizing-lg">Usuario:</span>
                                <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg"
                                    name="usuario" value={form.usuario} onChange={handleChange} required
                                />
                            </div>
                            <div className="input-group input-group-lg mb-3 ">
                                <span className="input-group-text" id="inputGroup-sizing-lg">Password:</span>
                                <input type="password" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg"
                                    name='password' value={form.password} onChange={handleChange} required
                                />
                            </div>
                            <select className='form-select form-select-lg mb-3' aria-label='.form-select-lg example'
                                name='rol' onChange={handleChange} required>
                                <option key={0} value="0">-- Seleccione Rol --</option>
                                {rol.map((rol) => (
                                    <option key={rol.id_rol} value={rol.id_rol}>{rol.name_rol}</option>
                                ))}
                            </select>
                            <button type='submit' className='btn btn-primary fs-5 col-5 d-flex justify-content-center align-self-center'>
                                <i className='bi bi-plus-circle pe-2'></i>Agregar Usuario
                            </button>
                        </form>
                    </section>

                    <section className='col-6 d-flex flex-column justify-content-center'>
                        {completed ? (
                            <TablaUsuarios fetchData={fetchUsuarios}/>
                        ) : (
                            <div></div>
                        )}
                    </section>
                </section>

            </section>
        </>
    )
}

export default Usuario