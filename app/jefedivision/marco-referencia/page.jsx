'use client'

import Navbar from '@/app/components/Navbar'
import React, { useEffect, useState } from 'react'
import './marco-referencia.css'
import { deleteAtributosEgreso, deleteCriterios, deleteIndicadores, deleteMarcoReferencia, getAllMaterias, getAtributosEgreso, getCriterioDesempenio, getIndicadores, getIndicadoresMaterias, getMarcoReferencia, listarCriterios, listarIndicadores, listarMaterias, saveAtributoEgreso, saveCriterioDesempenio, saveIndicador, saveMarcoReferencia, saveMateriasIndicador, validateField } from '@/app/js/jefedivision/marco-referencia'
import { user, validateToken, validateTokenAPI } from '@/app/js/auth/token'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, TextField } from '@mui/material'
import { getPeriodo } from '@/app/js/jefedivision/periodo'

const marcorf = () => {

    const [usuario, setUsuario] = useState('')
    const [periodo, setPeriodo] = useState('')
    const [mr, setMr] = useState([])
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

    // Dialogs
    const [openMR, setOpenMR] = useState(false)
    const [openAtributo, setOpenAtributo] = useState(false)
    const [openCriterio, setOpenCriterio] = useState(false)
    const [openIndicador, setOpenIndicador] = useState(false)

    // Forms
    const [formMR, setFormMR] = useState({
        descripcion: '',
        year_start: '',
        status: 'y'
    })
    const [formAtributo, setFormAtributo] = useState({
        marcoReferencia: {
            id: ''
        },
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

    const fetchNavbar = async () => {
        user(setUsuario)
        const { periodoActual } = await getPeriodo()
        setPeriodo(periodoActual ? periodoActual.year : '')
    }

    const fetchMarcoReferencia = async () => {
        const { marcoReferencia } = await getMarcoReferencia()
        setMr(marcoReferencia)
    }

    const fetchData = async () => {
        await getAtributosEgreso(setAtributos)
        await getCriterioDesempenio()
        await getIndicadores()
    }

    const fetchMaterias = async () => await getAllMaterias()

    const fetchMateriasIndicadores = async () => await getIndicadoresMaterias()

    useEffect(() => {
        validateToken()
        validateTokenAPI()

        fetchNavbar()
        fetchMarcoReferencia()
        fetchMaterias()
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

    const handleOpenMR = () => setOpenMR(true)
    const handleOpenAtributo = () => setOpenAtributo(true)
    const handleOpenCriterio = () => setOpenCriterio(true)
    const handleOpenIndicador = () => setOpenIndicador(true)
    const handleCloseMR = () => {
        cleanFormMR()
        setOpenMR(false)
    }
    const handleCloseAtributo = () => {
        cleanFormAtributo
        setOpenAtributo(false)
    }
    const handleCloseCriterio = () => {
        cleanFormCriterio()
        setOpenCriterio(false)
    }
    const handleCloseIndicador = () => {
        cleanFormIndicador()
        setOpenIndicador(false)
    }

    const handleChangeMR = (e) => {
        const { name, value } = e.target
        setFormMR(prev => ({
            ...prev,
            [name]: value.trimStart().toUpperCase()
        }))
    }

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

    const cleanFormMR = () => {
        setFormMR({
            descripcion: '',
            year_start: '',
            status: 'y'
        })
    }

    const cleanFormAtributo = () => {
        setFormAtributo({
            marcoReferencia: {
                id: ''
            },
            num_atributo: '',
            descripcion: ''
        })
    }

    const cleanFormCriterio = () => {
        setFormCriterio({
            atributoDesempenio: {
                id: ''
            },
            no_criterio: '',
            descripcion: ''
        })
    }

    const cleanFormIndicador = () => {
        setFormIndicador({
            criterioDesempenio: {
                id: ''
            },
            no_indicador: '',
            descripcion: ''
        })
    }

    const handleSubmitMR = async (e) => {
        e.preventDefault()
        // console.log(formMR)
        const bandera = validateField(formMR, 'dialogMR')
        if (bandera) {
            const banderaInsert = await saveMarcoReferencia(formMR)
            // console.log(banderaInsert)
            if (banderaInsert) {
                await deleteMarcoReferencia(mr)
                await saveMarcoReferencia(formMR)
                await deleteIndicadores(mr)
                await deleteCriterios(mr)
                await deleteAtributosEgreso(mr)

                window.location.reload()
            }
        }
    }

    const handleSubmitAtributo = async (e) => {
        e.preventDefault()
        // console.log(formAtributo)
        const bandera = validateField(formAtributo, 'dialogAtributo')
        if (bandera) {
            await saveAtributoEgreso(mr.id, formAtributo, fetchData)
            handleCloseAtributo()
        }
    }

    const handleSubmitCriterio = async (e) => {
        e.preventDefault()
        // console.log(formCriterio)
        const bandera = validateField(formCriterio, 'dialogCriterio')
        if (bandera) {
            await saveCriterioDesempenio(atributoActivo, formCriterio, fetchData)
            handleCloseCriterio()
            handleAtributo(atributoActivo)
        }
    }

    const handleSubmitIndicador = async (e) => {
        e.preventDefault()
        // console.log(formIndicador)
        const bandera = validateField(formIndicador, 'dialogIndicador')
        if (bandera) {
            await saveIndicador(formIndicador, fetchData)
            handleCloseIndicador()
            handleCriterio(criteriosActivo)
        }
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
            <Navbar home={"/jefedivision"} periodo={periodo} usuario={usuario} />
            <section className='container mt-3 d-flex flex-column mb-5'>
                <section className='d-flex align-items-center justify-content-around'>
                    <Button variant='outlined' startIcon={<i className='bi bi-plus-circle-fill fs-3' />}
                        color='secondary' className='col-sm-4 fs-5'
                        onClick={handleOpenMR}>
                        Crear Nuevo Marco de Referencia
                    </Button>
                    <Dialog open={openMR} onClose={handleCloseMR} id='dialogMR'>
                        <DialogTitle>Crear Nuevo Marco de Referencia</DialogTitle>
                        <DialogContent>
                            <FormControl sx={{ mt: 2, minWidth: 500 }}>
                                <TextField autoFocus
                                    margin='dense'
                                    name='descripcion'
                                    label='Descripcion'
                                    type='text'
                                    variant='outlined'
                                    value={formMR.descripcion}
                                    inputProps={{ maxLength: 10, placeholder: 'MR-20XX' }}
                                    onChange={handleChangeMR} />
                                <TextField
                                    margin='dense'
                                    name='year_start'
                                    label='Año de inicio'
                                    type='text'
                                    variant='outlined'
                                    value={formMR.year_start}
                                    inputProps={{ maxLength: 4 }}
                                    onChange={handleChangeMR}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '')
                                        handleChangeMR(e)
                                    }} />
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseMR}>Cancelar</Button>
                            <Button onClick={handleSubmitMR}>Guardar</Button>
                        </DialogActions>
                    </Dialog>
                    <h4>Marco de Referencia: {mr ? mr.descripcion : ''}</h4>
                </section>

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
                        <Dialog open={openAtributo} onClose={handleCloseAtributo} id='dialogAtributo'>
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
                                        inputProps={{ maxLength: 2 }}
                                        onChange={handleChangeAtributo} />
                                    <TextField
                                        margin='dense'
                                        name='descripcion'
                                        label='Descripcion del Atributo'
                                        type='text'
                                        variant='outlined'
                                        value={formAtributo.descripcion}
                                        inputProps={{ maxLength: 255 }}
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
                                <Dialog open={openCriterio} onClose={handleOpenCriterio} id='dialogCriterio'>
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
                                                inputProps={{ maxLength: 5 }}
                                                onChange={handleChangeCriterio}
                                            />
                                            <TextField
                                                margin='dense'
                                                name='descripcion'
                                                label='Criterio de desempeño'
                                                type='text'
                                                variant='outlined'
                                                value={formCriterio.descripcion}
                                                inputProps={{ maxLength: 255 }}
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
                                <Dialog open={openIndicador} onClose={handleOpenIndicador} id='dialogIndicador'>
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
                                                inputProps={{ maxLength: 4 }}
                                                onChange={handleChangeIndicador}
                                            />
                                            <TextField
                                                margin='dense'
                                                name='descripcion'
                                                label='Indicador'
                                                type='text'
                                                variant='outlined'
                                                value={formIndicador.descripcion}
                                                inputProps={{ maxLength: 255 }}
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