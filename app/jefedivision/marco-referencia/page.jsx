'use client'

import Navbar from '@/app/components/Navbar'
import React, { useEffect, useState } from 'react'
import './marco-referencia.css'
import { getAllMaterias, getAtributosEgreso, getCriterioDesempenio, getIndicadores, getIndicadoresMaterias, listarCriterios, listarIndicadores, listarMaterias, saveMateriasIndicador } from '@/app/js/jefedivision/marco-referencia'
import { user, validateToken, validateTokenAPI } from '@/app/js/auth/token'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, TextField } from '@mui/material'
import { getPeriodo } from '@/app/js/jefedivision/periodo'

const marcorf = () => {

    const [usuario, setUsuario] = useState('')
    const [periodo, setPeriodo] = useState('')
    const [atributos, setAtributos] = useState([
        // { 'atributo': "lola" },
        // { 'atributo': "lola" },
    ])
    const [atributoActivo, setAtributoActivo] = useState(null)
    const [criterios, setCriterios] = useState([
        // { "crit": "crit" },
        // { "crit": "crit" },
        // { "crit": "crit" },
        // { "crit": "crit" },
        // { "crit": "crit" },
        // { "crit": "crit" }
    ])
    const [criteriosActivo, setCriteriosActivo] = useState(null)
    const [indicadores, setIndicadores] = useState([
        // { "indicador": "indica" },
        // { "indicador": "indica" },
        // { "indicador": "indica" },
        // { "indicador": "indica" },
        // { "indicador": "indica" },
        // { "indicador": "indica" },
        // { "indicador": "indica" },
        // { "indicador": "indica" },
        // { "indicador": "indica" },
        // { "indicador": "indica" },
        // { "indicador": "indica" },
        // { "indicador": "indica" },
        // { "indicador": "indica" }
    ])
    const [indicadorActivo, setIndicadorActivo] = useState(null)
    const [materias, setMaterias] = useState([])
    const [materiasIndicador, setMateriasIndicador] = useState([])
    const [openAtributo, setOpenAtributo] = useState(false)
    const [openCriterio, setOpenCriterio] = useState(false)
    const [openIndicador, setOpenIndicador] = useState(false)
    const [formAtributo, setFormAtributo] = useState({
        id_mr: '',
        num_atributo: '',
        descripcion: ''
    })
    const [formCriterio, setFormCriterio] = useState({
        atributoDesempenio: {
            id: ''
        },
        no_criterio: '',
        descripcion: ''
    })
    const [formIndicador, setFormIndicador] = useState({
        criterioDesempenio: {
            id: ''
        },
        no_indicador: '',
        descripcion: ''
    })

    const fetchData = async () => {
        await getAtributosEgreso(setAtributos)
        await getCriterioDesempenio()
        await getIndicadores()
        await getAllMaterias()
    }

    const fetchNavbar = async () => {
        user(setUsuario)
        const { periodoActual } = await getPeriodo()
        setPeriodo(periodoActual)
    }

    const fetchMateriasIndicadores = async () => {
        await getIndicadoresMaterias()
    }

    useEffect(() => {
        validateToken()
        validateTokenAPI()

        fetchNavbar()
        fetchMateriasIndicadores()
        fetchData()
    }, [])

    const handleAtributo = (atrib) => {
        // console.log(atrib)
        setFormCriterio(prev => ({
            ...prev,
            atributoDesempenio: {
                id: atrib.id
            }
        }))
        setIndicadorActivo(null)
        setCriteriosActivo(null)
        setAtributoActivo(atrib)
        listarCriterios(setCriterios, atrib)
    }

    const handleCriterio = (crit) => {
        setFormIndicador(prev => ({
            ...prev,
            criterioDesempenio: {
                id: crit.id
            }
        }))
        setIndicadorActivo(null)
        setCriteriosActivo(crit)
        listarIndicadores(setIndicadores, crit)
    }

    const handleIndicador = async (ind) => {
        await fetchMateriasIndicadores()
        setIndicadorActivo(ind)
        const { materiasNoAsignadas, materiasAsignadas } = listarMaterias(ind)
        setMaterias(materiasNoAsignadas)
        setMateriasIndicador(materiasAsignadas)
    }

    const handleAddMateriaIndicador = (materia) => {
        setMateriasIndicador([...materiasIndicador, materia])
        setMaterias(materias.filter(item => item !== materia))
        // console.log(materia)
    }

    const handleQuitMateriaIndicador = (materia) => {
        setMaterias([...materias, materia])
        setMateriasIndicador(materiasIndicador.filter(item => item !== materia))
        // console.log(materia)
    }

    const handleOpenAtributo = () => setOpenAtributo(true)
    const handleOpenCriterio = () => setOpenCriterio(true)
    const handleOpenIndicador = () => setOpenIndicador(true)
    const handleCloseAtributo = () => setOpenAtributo(false)
    const handleCloseCriterio = () => setOpenCriterio(false)
    const handleCloseIndicador = () => setOpenIndicador(false)

    const handleChangeAtributo = (e) => {
        const { name, value } = e.target
        setFormAtributo(prev => ({
            ...prev,
            [name]: value.trimStart().toUpperCase()
        }))
    }

    const handleChangeCriterio = (e) => {
        const { name, value } = e.target
        setFormCriterio(prev => ({
            ...prev,
            [name]: value.trimStart().toUpperCase()
        }))
    }

    const handleChangeIndicador = (e) => {
        const { name, value } = e.target
        setFormIndicador(prev => ({
            ...prev,
            [name]: value.trimStart().toUpperCase()
        }))
    }

    const handleSubmitAtributo = (e) => {
        e.preventDefault()
    }
    const handleSubmitCriterio = (e) => {
        e.preventDefault()
        console.log(formCriterio)
    }

    const handleSubmitIndicador = (e) => {
        e.preventDefault()
        console.log(formIndicador)
    }

    const handleSave = async () => {
        // console.log(materiasIndicador)
        saveMateriasIndicador(indicadorActivo, materiasIndicador)
        fetchMateriasIndicadores()
        // console.log(indicadorActivo)
        // handleIndicador(indicadorActivo)
    }

    return (
        <>
            <Navbar home={"/jefedivision"} periodo={periodo ? periodo.year : ''} usuario={usuario} />
            <section className='container mt-3 d-flex flex-column mb-5'>
                <button type='button' className='btn btn-outline-info col-sm-4 fs-5'>
                    <i className='bi bi-plus-circle-fill me-2'></i>Crear Nuevo Marco de Referencia
                </button>

                <section className='d-flex justify-content-between mt-3'>
                    <section className='d-flex flex-column col-sm-4 p-2'>
                        <h4 className='text-center'>Atributos de Egreso</h4>
                        <div className='p-2 rounded borde'>
                            {atributos.length > 0 ? (
                                <div className='list-group list-scroll'>
                                    {atributos.map((atr, index) => (
                                        <button type='button'
                                            className={`list-group-item list-group-item-action ${atr === atributoActivo ? 'active' : ''}`}
                                            key={index}
                                            onClick={() => handleAtributo(atr)}>
                                            {`${atr.descripcion}`}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className='text-center'>No existen Atributos!</p>
                            )}

                        </div>
                        <Button variant='contained' className='mt-3 col-sm-8 align-self-center' color='inherit'
                            onClick={handleOpenAtributo}>
                            Agregar Atributo<i className='bi bi-plus-circle-fill ms-1'></i>
                        </Button>
                        <Dialog open={openAtributo} onClose={handleCloseAtributo} id='dialog'>
                            <DialogTitle>Registro de Atributos</DialogTitle>
                            <DialogContent>
                                <FormControl sx={{ mt: 2, minWidth: 500 }}>
                                    <TextField autoFocus
                                        margin='dense'
                                        name='num_atributo'
                                        label='Numero de atributo'
                                        type='text'
                                        variant='outlined'
                                        value={formAtributo.num_atributo}
                                        onChange={handleChangeAtributo} />
                                    <TextField
                                        margin='dense'
                                        name='descripcion'
                                        label='Descripcion del Atributo'
                                        type='text'
                                        variant='outlined'
                                        value={formAtributo.descripcion}
                                        onChange={handleChangeAtributo} />
                                </FormControl>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseAtributo}>Cancelar</Button>
                                <Button onClick={handleSubmitAtributo}>Guardar</Button>
                            </DialogActions>
                        </Dialog>
                    </section>

                    <section className='d-flex flex-column col-sm-4 p-2'>
                        <h4 className='text-center'>Criterios de Desempeño</h4>
                        <div className='p-2 rounded borde'>
                            {atributos.length > 0 ? (
                                atributoActivo !== null ? (
                                    criterios.length > 0 ? (
                                        <div className='list-group list-scroll'>
                                            {criterios.map((crt, index) => (
                                                <button type='button'
                                                    className={`list-group-item list-group-item-action ${crt === criteriosActivo ? 'active' : ''}`}
                                                    key={index}
                                                    onClick={() => handleCriterio(crt)}>
                                                    {`${crt.descripcion}`}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className='text-center'>No Existen Criterios de Desempeño!</p>
                                    )
                                ) : (
                                    <p className='text-center'>Seleccione un Atributo de Desempeño!</p>
                                )
                            ) : (
                                <p></p>
                            )}
                        </div>
                        {atributoActivo !== null ? (
                            <section className='d-flex justify-content-center'>
                                <Button variant='contained' className='mt-3 col-sm-8' color='inherit'
                                    onClick={handleOpenCriterio}>
                                    Agregar Criterio<i className='bi bi-plus-circle-fill ms-1'></i>
                                </Button>
                                <Dialog open={openCriterio} onClose={handleOpenCriterio} id='dialog'>
                                    <DialogTitle>Registro de Criterios</DialogTitle>
                                    <DialogContent>
                                        <FormControl sx={{ mt: 2, minWidth: 500 }}>
                                            <TextField autoFocus
                                                margin='dense'
                                                name='no_criterio'
                                                label='No Criterio'
                                                type='text'
                                                variant='outlined'
                                                value={formCriterio.no_criterio}
                                                onChange={handleChangeCriterio}
                                            />
                                            <TextField
                                                margin='dense'
                                                name='descripcion'
                                                label='Criterio de desempeño'
                                                type='text'
                                                variant='outlined'
                                                value={formCriterio.descripcion}
                                                onChange={handleChangeCriterio}
                                            />
                                        </FormControl>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleCloseCriterio}>Cancelar</Button>
                                        <Button onClick={handleSubmitCriterio}>Agregar</Button>
                                    </DialogActions>
                                </Dialog>
                            </section>
                        ) : (
                            <p></p>
                        )}
                    </section>

                    <section className='d-flex flex-column col-sm-4 p-2'>
                        <h4 className='text-center'>Indicadores</h4>
                        <div className='p-2 rounded borde'>
                            {atributoActivo !== null && criterios.length > 0 ? (
                                criteriosActivo !== null ? (
                                    indicadores.length > 0 ? (
                                        <div className='list-group list-scroll'>
                                            {indicadores.map((ind, index) => (
                                                <button type='button'
                                                    className={`list-group-item list-group-item-action ${ind === indicadorActivo ? 'active' : ''}`}
                                                    key={index}
                                                    onClick={() => handleIndicador(ind)}>
                                                    {`${ind.descripcion}`}

                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className='text-center'>No Existen indicadores!</p>
                                    )
                                ) : (
                                    <p className='text-center'>Seleccione un Criterio de Desempeño!</p>
                                )
                            ) : (
                                <p></p>
                            )}
                        </div>
                        {criteriosActivo !== null ? (
                            <section className='d-flex justify-content-center'>
                                <Button variant='contained' className='mt-3 col-sm-8' color='inherit'
                                    onClick={handleOpenIndicador}>
                                    Agregar Indicador<i className='bi bi-plus-circle-fill ms-1'></i>
                                </Button>
                                <Dialog open={openIndicador} onClose={handleOpenIndicador} id='dialog'>
                                    <DialogTitle>Registro de Indicador</DialogTitle>
                                    <DialogContent>
                                        <FormControl sx={{ mt: 2, minWidth: 500 }}>
                                            <TextField autoFocus
                                                margin='dense'
                                                name='no_indicador'
                                                label='No Indicador'
                                                type='text'
                                                variant='outlined'
                                                value={formIndicador.no_indicador}
                                                onChange={handleChangeIndicador}
                                            />
                                            <TextField
                                                margin='dense'
                                                name='descripcion'
                                                label='Indicador'
                                                type='text'
                                                variant='outlined'
                                                value={formIndicador.descripcion}
                                                onChange={handleChangeIndicador}
                                            />
                                        </FormControl>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleCloseIndicador}>Cancelar</Button>
                                        <Button onClick={handleSubmitIndicador}>Agregar</Button>
                                    </DialogActions>
                                </Dialog>
                            </section>
                        ) : (
                            <p></p>
                        )}
                    </section>

                </section>

                {indicadorActivo !== null ? (
                    <section className='d-flex justify-content-between mt-5'>
                        <section className='d-flex flex-column col-sm-5'>
                            <h2 className='text-center'>Materias</h2>
                            <div className='p-2 rounded borde'>
                                {/* Materias */}
                                {materias.length > 0 ? (
                                    <div className='list-group list-scroll'>
                                        {materias.map(materia => (
                                            <button type='button'
                                                className={`list-group-item list-group-item-action`}
                                                key={materia.clave_materia}
                                                onClick={() => handleAddMateriaIndicador(materia)}>
                                                {materia.nombre_materia}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className='text-center'>No hay materias registradas!</p>
                                )}
                            </div>
                        </section>

                        <section className='d-flex flex-column justify-content-center'>
                            {/* <button className='btn btn-info btn-lg mb-4'><i className='bi bi-caret-right-fill'></i></button> */}
                            {/* <button className='btn btn-info btn-lg'><i className='bi bi-caret-left-fill'></i></button> */}
                            <button className='btn btn-info btn-lg d-flex flex-column align-items-center'
                                onClick={handleSave}>
                                <i className='bi bi-floppy-fill'></i>Save
                            </button>
                        </section>

                        <section className='d-flex flex-column col-sm-5'>
                            <h2 className='text-center'>Asignadas</h2>
                            <div className='p-2 rounded borde text-center'>
                                {materiasIndicador.length > 0 ? (
                                    <div className='list-group list-scroll'>
                                        {materiasIndicador.map(materia => (
                                            <button type='button'
                                                className={`list-group-item list-group-item-action`}
                                                key={materia.clave_materia}
                                                onClick={() => handleQuitMateriaIndicador(materia)}>
                                                {materia.nombre_materia}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No hay materias registradas!</p>
                                )}
                            </div>
                        </section>
                    </section>

                ) : (
                    <p></p>
                )}

            </section>
        </>
    )
}

export default marcorf