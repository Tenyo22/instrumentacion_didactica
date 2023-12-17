const { default: Swal } = require("sweetalert2");
const { default: apiConfig } = require("../config/apiConfig");

// const API = "http://localhost:8081"
const API = apiConfig.apiMaterias
const token = localStorage.getItem("token");

module.exports.getPeriodo = async () => {
    try {
        const res = await fetch(`${API}/periodo`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        const data = await res.json()
        // console.log(data)
        const periodoActual = data[0]
        const periodosList = data

        // console.log(periodoActual, periodosList)
        return { periodoActual, periodosList }
    } catch (error) {
        console.error(error);
        return { periodoActual: null, periodosList: [] }
    }
}

module.exports.askPeriodo = async () => {
    const { isDismissed: result, value: newPeriodo } = await Swal.fire({
        icon: 'question',
        title: 'Ingrese el nuevo periodo!',
        input: 'text',
        inputPlaceholder: '2021-VER',
        inputAutoTrim: true,
        showCancelButton: true,
        confirmButtonText: 'Crear',
        inputAttributes: {
            maxLength: '8',
        },
        preConfirm: (inputValue) => {
            return inputValue.toUpperCase();
        }
    })
    // console.log(result)
    if (result) return false
    if (newPeriodo) {
        return newPeriodo
    } else {
        await Swal.fire({
            icon: 'info',
            title: 'Periodo No Valido!',
        })
    }
    return false
}

module.exports.createPeriodo = async (periodo, plan, especialidad) => {
    // console.log(periodo, plan, especialidad)
    const data = {
        "year": `${periodo}`,
        "planEstudios": {
            "clave": `${plan}`
        },
        "especialidad": {
            "clave": `${especialidad}`
        },
        "status": "y"
    }
    
    try {
        const result = await fetch(`${API}/periodo`, {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if (result.ok) {
            if (result.status === 201) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Periodo creado!',
                })
                return true
            } else {
                const mensaje = await result.json()
                await Swal.fire({
                    icon: 'info',
                    title: mensaje.mensaje,
                })
            }
        }
        return false
    } catch (e) {
        console.error(e)
    }
}

module.exports.deletePeriodo = async (periodo) => {
    console.log(periodo)
    try {
        const result = await fetch(`${API}/periodo/${periodo}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        if (result.ok) {
            if (result.status === 200) {

            }
        }
    } catch (e) {
        console.error(e)
    }
}