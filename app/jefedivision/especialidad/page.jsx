'use client'

import Navbar from '@/app/components/Navbar'
import { user, validateToken, validateTokenAPI } from '@/app/js/auth/token'
import { TablaMateriasEspecialidad, changeEspecialidad, createEspecialidad, deleteEspecialidad, deleteMateriasEspecialidad, getEspecialidad, getMateriasEspecialidad, insertMateriaEspecialidad, validateData } from '@/app/js/jefedivision/especialidad'
import { getPeriodo } from '@/app/js/jefedivision/periodo'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'

const Especialidad = () => {
    const [usuario, setUsuario] = useState('')
    const [periodo, setPeriodo] = useState('')
    const [completed, setCompleted] = useState(false)
    const [especialidad, setEspecialidad] = useState('')
    const [formulario, setFormulario] = useState({
        clave_materia_especialidad: '',
        especialidad: {
            clave: ""
        },
        nombreMateria: '',
        ht: '0',
        hp: '0',
        semestre: '7'
    })
    const [open, setOpen] = useState(false)
    const [formEspecialidad, setFormEspecialidad] = useState({
        clave: '',
        nombre_especialidad: ''
    })
    const rowsPerPageOptions = [4, 8]
    const [rowsPerPage, setRowsPerPage] = useState(4)
    const [page, setPage] = useState(0)

    const fetchData = async () => {
        user(setUsuario)
        const { periodoActual } = await getPeriodo()
        const { especialidadActual } = await getEspecialidad()
        setEspecialidad(especialidadActual)
        setPeriodo(periodoActual)
    }

    const fetchMaterias = async () => {
        setCompleted(false)
        await getMateriasEspecialidad()
        setCompleted(true)
    }

    useEffect(() => {
        validateToken()
        validateTokenAPI()

        fetchData()
        fetchMaterias()
    }, [])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0)
    };

    const handleEspecialidad = async (e) => {
        const res = await changeEspecialidad()
        res ? setOpen(true) : null
        // console.log(res)
    }

    const handleChange = (e) => {
        const { name, value, type } = e.target

        setFormulario(prev => ({
            ...prev,
            [name]: type === 'number' ? value : value.trimStart().toUpperCase()
        }))
    }

    const handleChangeEspecialidad = (e) => {
        const { name, value } = e.target
        setFormEspecialidad(prev => ({
            ...prev,
            [name]: value.trimStart().toUpperCase()
        }))
    }

    const cleanForm = () => {
        setFormulario({
            clave_materia_especialidad: '',
            especialidad: {
                clave: ""
            },
            nombreMateria: '',
            ht: '0',
            hp: '0',
            semestre: '7'
        })
    }

    const handleClose = () => setOpen(false)

    const handleSubmitCrear = async (e) => {
        // console.log('s')
        // console.log(especialidad)
        const result = await createEspecialidad(formEspecialidad)
        if(result){
            await deleteEspecialidad(especialidad.clave)
            await deleteMateriasEspecialidad(especialidad.clave)
            setOpen(false)
            window.location.reload();
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (validateData(especialidad)) {
            insertMateriaEspecialidad(formulario, especialidad, cleanForm, fetchMaterias)
        }
    }

    return (
        <>
            <Navbar home={"/jefedivision"} periodo={periodo ? periodo.year : ''} usuario={usuario} />
            <section className='container mt-5'>
                <section className='mb-4 d-flex align-items-center justify-content-around'>
                    <h4>Especialidad Actual: {especialidad ? especialidad.nombre_especialidad : ''}</h4>
                    <Button variant='contained' className='fs-6' onClick={handleEspecialidad}>
                        <i className='bi bi-patch-plus-fill me-2'></i>Cambiar Especialidad
                    </Button>
                    <Dialog open={open} onClose={handleClose} id='dialog'>
                        <DialogTitle>Nueva Especialidad</DialogTitle>
                        <DialogContent>
                            <TextField autoFocus
                                fullWidth
                                margin='dense'
                                name='clave'
                                label='Clave Especialidad'
                                type='text'
                                variant='outlined'
                                placeholder='ISIE-CLC-2010-01'
                                inputProps={{ maxLength: 22 }}
                                value={formEspecialidad.clave}
                                onChange={handleChangeEspecialidad}
                            />
                            <TextField
                                fullWidth
                                margin='dense'
                                name='nombre_especialidad'
                                label='Especialidad'
                                type='text'
                                variant='outlined'
                                placeholder='INTELIGENCIA DE NEGOCIOS'
                                inputProps={{ maxLength: 150 }}
                                value={formEspecialidad.nombre_especialidad}
                                onChange={handleChangeEspecialidad}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancelar</Button>
                            <Button onClick={handleSubmitCrear}>Crear</Button>
                        </DialogActions>
                    </Dialog>
                </section>

                <form onSubmit={handleSubmit} className='text-center'>
                    <section className='d-flex justify-content-evenly mb-4'>
                        <div className="col-8">
                            <div className="input-group input-group-lg">
                                <span className="input-group-text" id="inputGroup-sizing-lg">Materia</span>
                                <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg"
                                    name="nombreMateria" value={formulario.nombreMateria} onChange={handleChange} maxLength={150} required />
                            </div>
                        </div>
                        <div className="col-3">
                            <div>
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text" id="inputGroup-sizing-lg">Clave</span>
                                    <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg"
                                        name='clave_materia_especialidad' value={formulario.clave_materia_especialidad} onChange={handleChange} maxLength={12} required />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className='d-flex justify-content-evenly mb-4'>
                        <div className="col-3">
                            <div className="input-group input-group-lg">
                                <span className="input-group-text" id="inputGroup-sizing-lg">Horas Teoricas:</span>
                                <input type="number" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg"
                                    name='ht' value={formulario.ht} onChange={handleChange} min={0} max={4} required />
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="input-group input-group-lg">
                                <span className="input-group-text" id="inputGroup-sizing-lg">Horas Practica:</span>
                                <input type="number" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg"
                                    name='hp' value={formulario.hp} onChange={handleChange} min={0} max={4} required />
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="input-group input-group-lg">
                                <span className="input-group-text" id="inputGroup-sizing-lg">Semestre:</span>
                                <input type="number" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg"
                                    name='semestre' value={formulario.semestre} onChange={handleChange} min={7} max={8} required />
                            </div>
                        </div>
                    </section>
                    <button type='submit' className='btn btn-primary fs-5'><i className='bi bi-plus-square-fill'></i> Agregar Materia</button>
                </form>

                {completed ? (
                    <section className='mt-4'>
                        <TablaMateriasEspecialidad rowsPerPageOptions={rowsPerPageOptions} rowsPerPage={rowsPerPage} page={page} handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} />
                    </section>
                ) : (
                    <section>

                    </section>
                )}

            </section>
        </>
    )
}

export default Especialidad