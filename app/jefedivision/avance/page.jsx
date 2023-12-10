'use client'

import Navbar from '@/app/components/Navbar'
import { user, validateToken, validateTokenAPI } from '@/app/js/auth/token'
import { getTipoEvidencias } from '@/app/js/docentes/docentes'
import { filterMaterias, getAllMaterias, getEvidenciaById, getEvidenciasByDocentesAndPeriodo, getMateriasDocente } from '@/app/js/jefedivision/avance'
import { getDocentes } from '@/app/js/jefedivision/docentes'
import { getPeriodo } from '@/app/js/jefedivision/periodo'
import { Badge, Button, FormControl, InputLabel, Menu, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useEffect, useState } from 'react'

const avance = () => {
    const [usuario, setUsuario] = useState('')
    const [periodo, setPeriodo] = useState('')
    const [periodos, setPeriodos] = useState([])
    const [docentes, setDocentes] = useState([])
    const [periodoSelect, setPeriodoSelect] = useState('')
    const [docenteSelect, setDocenteSelect] = useState('')
    const [tipoEvidencias, setTipoEvidencias] = useState([])
    const [materiasDocente, setMateriasDocente] = useState([])
    const [menuAnchorEl, setMenuAnchorEl] = useState(false)

    const fetchNavbar = async () => {
        user(setUsuario)
        const { periodoActual, periodosList } = await getPeriodo()
        // console.log(periodosList)
        setPeriodo(periodoActual ? periodoActual.year : '')
        setPeriodos(periodosList ? periodosList : '')
    }

    const fetchData = async () => {
        await getDocentes(setDocentes)
        const { tipoEvidencias } = await getTipoEvidencias()
        setTipoEvidencias(tipoEvidencias)
        await getAllMaterias()
    }

    useEffect(() => {
        validateToken()
        validateTokenAPI()

        fetchNavbar()
        fetchData()


    }, [])

    useEffect(() => {
        const fetchMaterias = async () => {
            if (periodoSelect !== '' && docenteSelect !== '') {
                await getMateriasDocente(docenteSelect)
                await getEvidenciasByDocentesAndPeriodo(periodoSelect, docenteSelect)
                // setEvidencias(materiasEvidencia)
                const materias = filterMaterias()
                setMateriasDocente(materias)
            }
        }
        fetchMaterias()
    }, [periodoSelect, docenteSelect])

    const handleChangePeriodo = event => setPeriodoSelect(event.target.value)
    const handleChangeDocente = event => setDocenteSelect(event.target.value)

    const handleOpenFile = async (file) => {
        // window.open(file, '_blank')
        // console.log(file)
        await getEvidenciaById(file)
    }

    const handleOpenMenu = anchorEl => {
        setMenuAnchorEl(anchorEl)
    }

    const handleCloseMenu = () => setMenuAnchorEl(null)

    return (
        <>
            <Navbar home={"/jefedivision"} periodo={periodo} usuario={usuario} />
            <section className='container mt-4'>
                <section className='row justify-content-around'>
                    <div className='col-sm-12 col-md-4 mb-3'>
                        <FormControl variant='filled' fullWidth>
                            <InputLabel id="demo-simple-select-standard-label">Periodo</InputLabel>
                            <Select
                                labelId='demo-simple-select-standard-label'
                                id='demo-simple-select-standard'
                                value={periodoSelect}
                                onChange={handleChangePeriodo}
                                label="Periodo">
                                {periodos.map(per => (
                                    <MenuItem key={per.id_periodo} value={per.id_periodo}>
                                        {per.year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className='col-sm-12 col-md-6 mb-3'>
                        <FormControl variant='filled' fullWidth>
                            <InputLabel id="demo-simple-select-standar-label">Docente</InputLabel>
                            <Select
                                labelId='demo-simple-select-standard-label'
                                id='demo-simple-select-standard'
                                value={docenteSelect}
                                onChange={handleChangeDocente}
                                label="Docente">
                                {docentes.map(doc => (
                                    <MenuItem key={doc.id} value={doc.id}>
                                        {doc.nombre_docente + " " + doc.ape1 + " " + doc.ape2}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </section>

                <section className='mb-5'>
                    <h2>Tabla de Evidencias</h2>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Materias</TableCell>
                                    {tipoEvidencias.map(evid => (
                                        // console.log(evid)
                                        <TableCell key={evid.id} className='text-center'>{evid.descripcion}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {materiasDocente.map(mat => (
                                    <TableRow key={mat.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>{mat.nombre_materia}</TableCell>
                                        {tipoEvidencias.map((evid) => {
                                            const evidenciasMateria = mat.evidencias.filter(e => e.evidencia.id === evid.id)
                                            return (
                                                <TableCell key={evid.id} className='text-center'>
                                                    {evidenciasMateria.length > 1 ? (
                                                        <>
                                                            {/* {evidenciasMateria.map(evidencia => (
                                                            <button key={evidencia.idEvidencia}
                                                            className='btn btn-info'
                                                            onClick={() => handleOpenFile(evidencia.idEvidencia)}>
                                                            <i className='bi bi-file-earmark-pdf-fill'></i>
                                                            </button>
                                                        ))} */}
                                                            <Button variant='outlined'
                                                                onClick={(event) => handleOpenMenu(event.currentTarget)}>
                                                                <Badge badgeContent={evidenciasMateria.length} color='primary'>
                                                                    <i className='bi bi-file-earmark-pdf-fill'></i>
                                                                </Badge>
                                                            </Button>
                                                            <Menu anchorEl={menuAnchorEl}
                                                                open={Boolean(menuAnchorEl)}
                                                                onClose={handleCloseMenu}>
                                                                {evidenciasMateria.map(evidencia => (
                                                                    <MenuItem key={evidencia.idEvidencia}
                                                                        className='btn btn-info'
                                                                        onClick={() => handleOpenFile(evidencia.idEvidencia)}>
                                                                        <i className='bi bi-file-earmark-pdf-fill fs-5'></i>
                                                                    </MenuItem>
                                                                ))}
                                                            </Menu>
                                                        </>
                                                    ) : (
                                                        evidenciasMateria.map(evidencia => (
                                                            <button key={evidencia.idEvidencia}
                                                                className='btn btn-info'
                                                                onClick={() => handleOpenFile(evidencia.idEvidencia)}>
                                                                <i className='bi bi-file-earmark-pdf-fill'></i>
                                                            </button>
                                                        ))
                                                    )}
                                                    {evidenciasMateria.length === 0 && 'X'}
                                                </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </section>
            </section >
        </>
    )
}

export default avance