import Cookies from "js-cookie";

const { TableContainer, Paper, Table, TableHead, TableRow, TableBody, TableCell, TablePagination, TableFooter } = require("@mui/material");
const { useState } = require("react");
const { default: Swal } = require("sweetalert2");
const { default: apiConfig } = require("../config/apiConfig");

// const API = "http://localhost:8080"
const API = apiConfig.apiUsuarios
// const token = localStorage.getItem("token");
const token = Cookies?.get("token") || "none"

let usuarios = []

module.exports.getUsuarios = async () => {
    const res = await fetch(`${API}/users`, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })
    const data = await res.json()
    // console.log(data)
    const newUser = data.map(({ id_usuario, rol, usuario }) => ({
        id_usuario,
        rol,
        usuario
    }))
    // console.log(user)
    const uniqueUser = newUser.filter(newUser => !usuarios.some(exists => exists.id_usuario === newUser.id_usuario))
    usuarios.push(...uniqueUser)
    // console.log(usuarios)
}

module.exports.getUsuariosDocentes = async () => {
    const res = await fetch(`${API}/users/docentes`, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })
    if (res.ok) {
        if (res.status === 200) {
            const data = await res.json();
            // console.log(data)
            return { data }
        }
    }
}

module.exports.getRol = async (setRol) => {
    const res = await fetch(`${API}/roles`, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })
    const data = await res.json()

    const roles = data.map(rol => ({
        ...rol,
        name_rol: rol.name_rol.replace('ROLE_', '')
    }))
    setRol(roles)
    // console.log(data)
}

module.exports.validateData = (data) => {
    // console.log(data)
    if (data.rol === '0') {
        Swal.fire({
            title: "Rol Incorrecto!",
            text: "Por favor, seleccione un rol valido!",
            icon: "error"
        })
        return false
    }
    return true
}

module.exports.InsertUser = async (data) => {
    data.status_rol = 'y'
    const obj = {
        ...data,
        rol: { id_rol: data.rol }
    }

    const response = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    })
    // console.log(obj)
    if (response.ok) {
        if (response.status === 201) {
            // console.log('Usuario creado!')
            Swal.fire({
                icon: "success",
                title: "Usuario creado!"
            })
        } else {
            const responseData = await response.json()
            Swal.fire({
                icon: "info",
                title: responseData.mensaje
            })
            // console.log(responseData)
        }
    } else {
        // console.log('Algo ocurrio');
        Swal.fire({
            icon: "error",
            title: "Algo ocurrio!"
        })
    }
}

const clearUsers = () => {
    usuarios = []
}

export function TablaUsuarios({ fetchData }) {

    const rowsPerPageOptions = [3, 5]
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteUsuario = async (user) => {
        console.log(user)
        const response = await fetch(`${API}/users/${user}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            }
        })
        // console.log(response.status)

        if (response.ok) {
            // console.log("Ok")
            clearUsers()
            fetchData()

            await Swal.fire({
                icon: 'success',
                title: "Usuario eliminado!"
            })
            // changeCompleted(true)
        } else if (response.status === 404) {
            const responseData = await response.json()
            Swal.fire({
                icon: "info",
                title: responseData.mensaje
            })
        } else {
            console.log("error")
            Swal.fire({
                icon: 'error',
                title: 'Ocurrio un error!'
            })
        }
    }

    return <section>
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell className="text-center">Usuario</TableCell>
                        <TableCell className="text-center">Rol</TableCell>
                        <TableCell className="text-center">Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {usuarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
                        // console.log(user),
                        <TableRow key={user.id_usuario} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                            <TableCell component='th' scope="row" className="text-center">{user.usuario}</TableCell>
                            <TableCell component='th' scope="row" className="text-center">{user.rol.id_rol === 1 ? 'ADMIN' : user.rol.name_rol}</TableCell>
                            <TableCell component='th' scope="row" className="text-center">
                                <button type='button' className='btn btn-danger ms-2' onClick={() => handleDeleteUsuario(user.id_usuario)}>
                                    <i className="bi bi-trash-fill"></i>
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={rowsPerPageOptions}
                            // colSpan={3}
                            // component="section"
                            count={usuarios.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        // sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    </section>

}