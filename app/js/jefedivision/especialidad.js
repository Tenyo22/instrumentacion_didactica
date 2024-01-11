import Cookies from "js-cookie"

const { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } = require("@mui/material")
const { default: apiConfig } = require("../config/apiConfig")
const { default: Swal } = require("sweetalert2")

const API = apiConfig.apiMaterias
// const token = localStorage.getItem("token")
const token = Cookies?.get("token") || "none"

let materias = []


module.exports.getEspecialidad = async () => {
    try {
        const result = await fetch(`${API}/especialidad`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        if (result.ok) {
            if (result.status === 200) {
                const data = await result.json()
                const especialidadActual = data[0]
                // console.log(data)
                return { especialidadActual }
            }
        }
    } catch (e) {
        console.error(e)
    }
}

module.exports.changeEspecialidad = async () => {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "Tendra que ingresar nuevas materias de especialidad!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
    })
    return result.isConfirmed
}

module.exports.deleteMateriasEspecialidad = async (clave) => {
    // console.log(clave)
    try {
        const result = await fetch(`${API}/especialidadmaterias/especialidad/${clave}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            }
        })
        // if(result.ok) {
        //     if(result.status === 200){
        //         Swal.fire({
        //             icon: "success",
        //             title: "Materias"
        //         })
        //     }
        // }
    } catch (e) {
        console.error(e)
    }

}

module.exports.createEspecialidad = async (form) => {
    let data = form
    data.status = 'y'
    try {
        const result = await fetch(`${API}/especialidad`, {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        if (result.ok) {
            if (result.status === 201) {
                await Swal.fire({
                    icon: "success",
                    title: "Especialidad Creada",
                    target: document.getElementById('dialog')
                })
                return true
            } else {
                const mensaje = await result.json()
                await Swal.fire({
                    icon: 'info',
                    title: mensaje.mensaje,
                    target: document.getElementById('dialog')
                })
                return false
            }
        }
    } catch (e) {
        console.error(e)
    }
    // console.log(data)
}

module.exports.deleteEspecialidad = async (clave) => {
    try {
        const res = await fetch(`${API}/especialidad/${clave}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            }
        })
        if (res.ok) {
            if (res.status === 404) {
                const mensaje = await res.json()
                await Swal.fire({
                    icon: 'info',
                    title: mensaje.mensaje
                })
            }
        }
    } catch (e) {
        console.error(e)
    }
}

module.exports.getMateriasEspecialidad = async () => {
    try {
        const result = await fetch(`${API}/especialidadmaterias`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        if (result.ok) {
            if (result.status === 200) {
                const data = await result.json()
                const uniqueMaterias = data.filter(mat => !materias.some(exists => exists.clave_materia_especialidad === mat.clave_materia_especialidad))
                materias.push(...uniqueMaterias)
                return materias
                // console.log(data)
                // console.log(materias)
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Ocurrio un error!'
            })
        }
    } catch (e) {
        console.error(e)
    }
}

module.exports.getMateriasEspecialidadAvance = async () => {
    try {
        const result = await fetch(`${API}/especialidadmaterias/avance`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        if (result.ok) {
            if (result.status === 200) {
                const materiasEspecialidad = await result.json()
                // console.log(materiasEspecialidad)
                return { materiasEspecialidad }
                // console.log(data)
                // console.log(materias)
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Ocurrio un error!'
            })
        }
    } catch (e) {
        console.error(e)
    }
}

module.exports.validateData = async (especialidad) => {
    if (especialidad.clave === '') {
        Swal.fire({
            icon: 'info',
            title: "Se requiere una clave de especialidad!"
        })
        return false
    }
    return true
    // console.log(formulario)
}

module.exports.insertMateriaEspecialidad = async (formulario, especialidad, cleanForm, fetchMaterias) => {
    let data = formulario
    data.cr = `${parseInt(formulario.ht, 10) + parseInt(formulario.hp, 10)}`
    data.especialidad.clave = especialidad.clave
    data.status = 'y'

    try {
        const result = await fetch(`${API}/especialidadmaterias`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        if (result.ok) {
            if (result.status === 200) {
                const mensaje = await result.json()
                Swal.fire({
                    icon: 'info',
                    title: mensaje.mensaje,
                })
            }
            if (result.status === 201) {
                fetchMaterias()
                cleanForm()
                Swal.fire({
                    icon: 'success',
                    title: 'Materia Agregada Exitosamente!'
                })
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Sucedio un error!",
            })
        }
    } catch (e) {
        console.error(e)
    }
    // console.log(data)
}

export function TablaMateriasEspecialidad({ rowsPerPageOptions, rowsPerPage, page, handleChangePage, handleChangeRowsPerPage }) {
    const columns = [
        { id: 'materia', label: 'Materia' },
        { id: 'clave', label: 'Clave' },
        { id: 'ht', label: 'HT' },
        { id: 'hp', label: 'HP' },
        { id: 'cr', label: 'CR' },
        { id: 'semestre', label: 'Semestre' }
    ]

    // const filterData = materias.filter(row => {
    //     return (row.nombre_materia.includes(searchText) || row.clave_materia.includes(searchText))
    // })

    return <section className="mb-5">
        <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TablePagination className="mt-2"
                            rowsPerPageOptions={rowsPerPageOptions}
                            // component="section"
                            count={materias.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage} >
                        </TablePagination>
                    </TableRow>
                    <TableRow>
                        {columns.map(column => (
                            <TableCell key={column.id}>{column.label}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {materias.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                        <TableRow key={row.clave_materia_especialidad} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component='th' scope="row">{row.nombreMateria}</TableCell>
                            <TableCell component='th' scope="row">{row.clave_materia_especialidad}</TableCell>
                            <TableCell component='th' scope="row">{row.ht}</TableCell>
                            <TableCell component='th' scope="row">{row.hp}</TableCell>
                            <TableCell component='th' scope="row">{row.cr}</TableCell>
                            <TableCell component='th' scope="row">{row.semestre}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </section>
}

module.exports.askEspecialidad = async (especialidad) => {
    const result = await Swal.fire({
        icon: 'info',
        title: `La especialidad: <b><i>${especialidad}</i></b> sigue siendo la misma?`,
        confirmButtonText: 'Si',
        confirmButtonColor: '#2979FF',
        showDenyButton: true,
        denyButtonText: 'Cambiar',
        denyButtonColor: '#41c300',
        showCancelButton: true,
    })
    if (result.isDenied) return false
    if (result.isDismissed) return result.dismiss

    return true
}