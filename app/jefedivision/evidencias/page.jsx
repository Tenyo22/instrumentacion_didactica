'use client'

import Navbar from '@/app/components/Navbar'
import { user } from '@/app/js/auth/token'
import { createTipoEvidencia, deleteTipoEvidencia, getTipoEvidencias } from '@/app/js/jefedivision/evidencias'
import { getPeriodo } from '@/app/js/jefedivision/periodo'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import React, { useEffect, useState } from 'react'

const page = () => {
    const [usuario, setUsuario] = useState('')
    const [periodo, setPeriodo] = useState('')
    const [evidencias, setEvidencias] = useState([])
    const [completed, setCompleted] = useState(false)
    const [form, setForm] = useState({
        descripcion: ''
    })

    const rowsPerPageOptions = [5, 10]
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [page, setPage] = useState(0)


    const fetchNavbar = async () => {
        user(setUsuario)

        const { periodoActual } = await getPeriodo()
        setPeriodo(periodoActual)
    }

    const fetchData = async () => {
        setCompleted(false)
        const { evidencias } = await getTipoEvidencias()
        setEvidencias(evidencias)
        setCompleted(true)
    }

    useEffect(() => {
        fetchNavbar()
        fetchData()
    }, [])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0)
    };

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({
            ...prev,
            [name]: value.trimStart()
        }))
    }

    const clean = () => setForm({ descripcion: '' })

    const handleDeleteEvidencia = (evid) => {
        // console.log(evid)
        deleteTipoEvidencia(evid, fetchData)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        createTipoEvidencia(form, clean, fetchData)
        // console.log(form)
    }

    return (
        <>
            <Navbar home={"/jefedivision"} usuario={usuario} periodo={periodo ? periodo.year : ''} />
            <section className='container mt-5'>
                <section className='container'>
                    <form onSubmit={handleSubmit} className='row justify-content-between'>
                        <div className='col-sm-9'>
                            <div className="input-group input-group-lg mb-3">
                                <span className="input-group-text" id="inputGroup-sizing-lg">Tipo de Evidencia:</span>
                                <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg"
                                    name="descripcion" value={form.descripcion} onChange={handleChange} required
                                />
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <button type='submit' className='btn btn-primary fs-5'>
                                <i className='bi bi-plus-circle pe-2'></i>Agregar
                            </button>
                        </div>
                    </form>
                </section>

                <section className='mt-4'>
                    {evidencias.length > 0 && completed ? (
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                                <TableHead>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={rowsPerPageOptions}
                                            // component="section"
                                            count={evidencias.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage} />
                                    </TableRow>
                                    <TableRow>
                                        <TableCell key="tipo_evidencia">Tipo de Evidencia</TableCell>
                                        <TableCell key="opciones">Opciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {evidencias.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                                        <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell component='th' scope='row'>{row.descripcion}</TableCell>
                                            <TableCell component='th' scope='row'>
                                                <button type='button' className='btn btn-danger ms-2' onClick={() => handleDeleteEvidencia(row)}>
                                                    <i className='bi bi-trash-fill'></i>
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <section></section>
                    )}
                </section>

            </section>
        </>
    )
}

export default page