'use client'

import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import './docente.css'
import { getAllMaterias, getDocentes, getMateriasDocente, getMateriasDocentes, getUsuariosDoc, insertMaterias, materiasNoAsignadas, saveDocente, validateDataDocente } from '@/app/js/jefedivision/docentes'
import { user, validateToken, validateTokenAPI } from '@/app/js/auth/token'
import { getPeriodo } from '@/app/js/jefedivision/periodo'
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, List, ListItem, ListItemText, Menu, MenuItem, Select, TextField } from '@mui/material'
import { getPlanActualEstudios } from '@/app/js/jefedivision/plan-estudios'

const page = () => {

    const [usuario, setUsuario] = useState('')
    const [periodo, setPeriodo] = useState('')
    const [docentes, setDocentes] = useState([])
    const [materiasDocente, setMateriasDocente] = useState([])
    const [docenteActivo, setDocenteActivo] = useState(null)
    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [form, setForm] = useState({
        nombre_docente: '',
        id_usuario: '',
        ape1: '',
        ape2: '',
        status: 'y',
    })
    const [contextMenu, setContextMenu] = useState(null)
    const [docenteEliminar, setDocenteEliminar] = useState(null)
    const [materias, setMaterias] = useState([])
    const [materiasSeleccionadas, setMateriasSeleccionadas] = useState([])
    const [filtroMateria, setFiltroMateria] = useState('')
    const [planActual, setPlanActual] = useState('')

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const [usuarios, setUsuarios] = useState([
        // { id: 1, usuario: "jose" },
        // { id: 2, usuario: "Juan" },
        // { id: 3, usuario: "manuel" },
        // { id: 4, usuario: "Juan" }
    ])

    const fetchDocentes = async () => await getDocentes(setDocentes)

    const fetchNavbar = async () => {
        user(setUsuario)
        const { periodoActual } = await getPeriodo()
        setPeriodo(periodoActual)
    }

    const fetchData = async () => {
        validateToken()
        await validateTokenAPI()

        // await getDocentes(setDocentes)
        fetchDocentes()
        const { planActual } = await getPlanActualEstudios()
        setPlanActual(planActual)

        await getUsuariosDoc(setUsuarios)
        await getMateriasDocentes()
    }

    const fetchMaterias = () => {
        const { listaMaterias } = materiasNoAsignadas()
        setMaterias(listaMaterias)
    }

    useEffect(() => {
        fetchData()
        fetchNavbar()
    }, [])

    const handleDocente = async (docente) => {
        setDocenteActivo(docente)
        await getAllMaterias(planActual)
        const { materiasDocente } = await getMateriasDocente(docente, periodo.id_periodo)
        setMateriasDocente(materiasDocente)
    }

    const handleOpen = () => setOpen(true)

    const handleClose = () => {
        setOpen(false)
        clean()
    }

    const handleClose2 = () => {
        setOpen2(false)
    }
    const clean = () => {
        setForm({
            nombre_docente: '',
            id_usuario: '',
            ape1: '',
            ape2: '',
            status: 'y',
        })
    }

    const handleChange = (e) => {
        const { name, value, type } = e.target
        if (type === "text") {
            setForm(prevForm => ({
                ...prevForm,
                [name]: value.trimStart().toUpperCase()
            }))
        } else {
            setForm(prevForm => ({
                ...prevForm,
                [name]: value
            }))
        }
        // console.log(name, value, type)
    }

    const handleContextMenu = (event, user) => {
        event.preventDefault();
        setDocenteEliminar(user)
        setContextMenu(
            contextMenu === null ? {
                mouseX: event.clientX + 2,
                mouseY: event.clientY - 6,
            } : null,
        )
        // console.log(event, user)
    }

    const handleCloseMenuContext = () => setContextMenu(null)

    const handleDeleteDocente = (e) => {
        console.log(docenteEliminar)
        setContextMenu(null)
    }

    const handleAddMateria = () => {
        fetchMaterias()
        setOpen2(true)
    }

    const toggleMateria = (claveMateria) => {
        setMateriasSeleccionadas((prevSelected) => {
            if (prevSelected.includes(claveMateria)) {
                return prevSelected.filter((materia) => materia !== claveMateria);
            } else {
                return [...prevSelected, claveMateria];
            }
        });
    }

    const materiasFiltradas = materias.filter(mat => mat.nombre_materia.toUpperCase().includes(filtroMateria.toUpperCase()))

    const handleSubmitDocente = async (e) => {
        if (validateDataDocente(form)) {
            // console.log('si')
            await saveDocente(form)
            // console.log('si')
            handleClose()
            fetchDocentes()
        }
        // console.log(form)
    }

    const cleanMateriasSeleccionadas = () => setMateriasSeleccionadas([])

    const handleAsignar = () => {
        // console.log(materiasSeleccionadas)
        if (materiasSeleccionadas.length > 0) {
            insertMaterias(docenteActivo, materiasSeleccionadas, periodo)
            cleanMateriasSeleccionadas()
            handleDocente(docenteActivo)
        }
        handleClose2()
    }

    return (
        <>
            <Navbar home="/jefedivision" periodo={periodo ? periodo.year : ''} usuario={usuario} />

            {/* Contenedor principal */}
            <section className='m-5 mt-2'>

                <section className='container d-flex justify-content-between'>

                    {/* Seccion para mostrar los docentes */}
                    <section className='col-5 ps-5 d-flex flex-column'>
                        <h3 className='text-center'>Docentes</h3>

                        <div className='list-group list-docentes'>
                            {docentes.map(doc => (
                                <button type='button'
                                    className={`list-group-item list-group-item-action ${doc === docenteActivo ? 'active' : ''}`}
                                    key={doc.id}
                                    onClick={() => handleDocente(doc)}
                                    onContextMenu={(e) => handleContextMenu(e, doc)}>
                                    {`${doc.nombre_docente} ${doc.ape1} ${doc.ape2}`}
                                </button>
                            ))}
                            <Menu open={contextMenu !== null}
                                onClose={handleCloseMenuContext}
                                anchorReference='anchorPosition'
                                anchorPosition={
                                    contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                                        : undefined
                                }>
                                <MenuItem onClick={handleDeleteDocente}>Delete</MenuItem>
                            </Menu>
                        </div>

                        {/* Seccion para agregar docentes - Dialog -> Ventana flotante */}
                        <div className='mt-4 d-flex justify-content-center'>
                            <Button variant="contained" className='fs-5'
                                onClick={handleOpen}>
                                <i className='bi bi-plus-circle-fill pe-2'></i>Agregar Docente
                            </Button>
                            <Dialog open={open} onClose={handleClose} id="dialog">
                                <DialogTitle>Registro de Docente</DialogTitle>
                                <DialogContent>
                                    <DialogContent>
                                        <TextField autoFocus
                                            fullWidth
                                            margin='dense'
                                            name='nombre_docente'
                                            label="Nombre de Docente"
                                            type='text'
                                            variant='outlined'
                                            value={form.nombre_docente}
                                            onChange={handleChange} />
                                        <TextField autoFocus
                                            fullWidth
                                            margin='dense'
                                            name='ape1'
                                            label="Primer Apellido"
                                            type='text'
                                            variant='outlined'
                                            value={form.ape1}
                                            onChange={handleChange}
                                        />
                                        <TextField autoFocus
                                            fullWidth
                                            margin='dense'
                                            name='ape2'
                                            label="Segundo Apellido"
                                            type='text'
                                            variant='outlined'
                                            value={form.ape2}
                                            onChange={handleChange}
                                        />
                                        <FormControl sx={{ mt: 2, width: '100%' }}>
                                            <InputLabel id="simple-select-label">Usuario</InputLabel>
                                            <Select
                                                labelId="simple-select-label"
                                                name='id_usuario'
                                                value={form.id_usuario}
                                                label="Usuario"
                                                onChange={handleChange}
                                            >
                                                <MenuItem key={0} value={0}><em>None</em></MenuItem>
                                                {usuarios.map(name => (
                                                    <MenuItem
                                                        key={name.id_usuario}
                                                        value={name.id_usuario}
                                                    // onClick={() => handleChange(name)}
                                                    >
                                                        {name.usuario}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </DialogContent>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose}>Cancelar</Button>
                                    <Button onClick={handleSubmitDocente}>Guardar</Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </section>

                    {/* Seccion para mostrar las materias de los docentes */}
                    <section className='col-6 mt-5 d-flex justify-content-center'>
                        {/* <h5>Seleccione un Docente para visualizar las materias!</h5> */}
                        {docenteActivo ? (
                            <div className='col-12 text-center'>
                                {materiasDocente.length > 0 ? (
                                    <div className='list-group'>
                                        {materiasDocente.map(doc => (
                                            // console.log(doc),
                                            <button type='button'
                                                className='list-group-item list-group-item-action'
                                                key={doc.clave}>{doc.materia}</button>
                                        ))}
                                    </div>
                                ) : (
                                    <h5>No hay materias asignadas!</h5>
                                )}
                                <button type='button' className='btn btn-primary mt-3' onClick={handleAddMateria}>
                                    <i className='bi bi-plus-circle-fill'></i> Asignar Materia
                                </button>
                                <Dialog open={open2} onClose={handleClose2} maxWidth="sm" fullWidth>
                                    <DialogTitle>Materias</DialogTitle>
                                    <DialogContent>
                                        <TextField label="Nombre Materia"
                                            variant='outlined'
                                            fullWidth
                                            value={filtroMateria}
                                            margin='normal'
                                            onChange={(e) => setFiltroMateria(e.target.value)} />
                                        <List>
                                            {materiasFiltradas.map(mat => (
                                                <ListItem key={mat.clave_materia} disablePadding>
                                                    <Checkbox edge="start"
                                                        // checked={materiasSeleccionadas.includes(mat.clave_materia)}
                                                        onChange={() => toggleMateria(mat.clave_materia)}
                                                    />
                                                    <ListItemText primary={mat.nombre_materia} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose2}>Cancel</Button>
                                        <Button onClick={handleAsignar}>Asignar</Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                        ) : (
                            docentes.length > 0 ? (
                                <h5 className='text-center'>Seleccione un Docente para visualizar las materias!</h5>
                            ) : (
                                <h5>No hay docentes!</h5>
                            )
                        )}
                    </section>
                </section>
            </section >

        </>
    )
}

export default page