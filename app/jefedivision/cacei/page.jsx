'use client'

import Navbar from '@/app/components/Navbar'
import { validateToken, validateTokenAPI } from '@/app/js/auth/token';
import { TablaCacei, createClasificacion, deleteCompetencia, getClasificacion, updateClasificacion } from '@/app/js/jefedivision/cacei';
import React, { useEffect, useState } from 'react'

const cacei = () => {
    const [form, setForm] = useState({
        id: '0',
        descripcion: '',
        color: '#000000'
    })
    const [completed, setCompleted] = useState(false)
    const [boton, setBoton] = useState('Agregar')

    const fetchData = async () => {
        setCompleted(false)
        await getClasificacion()
        setCompleted(true)
    }

    useEffect(() => {
        validateToken()
        validateTokenAPI()
        fetchData()
    }, [])

    const clean = () => {
        setForm({
            id: '0',
            descripcion: '',
            color: '#000000'
        })
        setBoton('Agregar')
    }

    const handleEdit = (competencia) => {
        // console.log(competencia)
        setBoton('Actualizar')
        setForm({
            id: competencia.id,
            descripcion: competencia.descripcion,
            color: competencia.color
        })
    }
    
    const handleDelete = async(competencia) => {
        await deleteCompetencia(competencia, fetchData)
        clean()
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: value.trimStart()
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(boton.includes("Agregar")){
            await createClasificacion(form, fetchData)
            clean()
        }else{
            await updateClasificacion(form, fetchData)
            clean()
        }
        // console.log(form)
    }

    return (
        <>
            <Navbar home={"/jefedivision"} periodo={"2020"} usuario={"Yo"} />

            <section className='container mt-5'>
                <form onSubmit={handleSubmit} className='container d-flex flex-column'>
                    <div className='d-flex align-items-center justify-content-evenly'>
                        <div className='col-8'>
                            <div className="input-group">
                                <span className="input-group-text">Competencia</span>
                                <div className="form-floating">
                                    <input type="text" className="form-control" id="floatingInputGroup1"
                                        name='descripcion' value={form.descripcion} onChange={handleChange} required />
                                    <label htmlFor="floatingInputGroup1">Competencia o Area de Aplicación</label>
                                </div>
                            </div>
                        </div>

                        <input type='color' className='col-1' name='color' value={form.color}
                            onChange={handleChange} required />
                    </div>

                    <button type='submit' className='btn btn-primary align-self-center col-3 mt-3 mb-5'>
                        {boton}<i className='bi bi-plus-circle ms-1' />
                    </button>
                </form>

                <section className='mt-3 mb-5'>
                    {completed ? (
                        <TablaCacei onEditar={handleEdit} onDelete={handleDelete} />
                    ) : (
                        <div></div>
                    )}
                </section>

            </section>
        </>
    )
}

export default cacei