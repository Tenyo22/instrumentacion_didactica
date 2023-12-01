const { default: Swal } = require("sweetalert2");
const { default: apiConfig } = require("../config/apiConfig");

const API = apiConfig.apiDocentes
const token = localStorage.getItem("token");

let evidencias = []

module.exports.getTipoEvidencias = async () => {
    evidencias = []
    try {
        const result = await fetch(`${API}/evidencias`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        if (result.ok) {
            if (result.status === 200) {
                const data = await result.json();
                const dataUnique = data.filter(evid => !evidencias.some(exists => exists.id === evid.id))
                evidencias.push(...dataUnique)
                // console.log(evidencias)
                return { evidencias }
            }
        }
    } catch (e) {
        console.error(e)
    }
}

module.exports.createTipoEvidencia = async (evidencia, clean, fetchData) => {
    const obj = evidencia
    obj.status = 'y'
    // console.log(obj)
    try {
        const result = await fetch(`${API}/evidencias`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj)
        })
        if (result.ok) {
            if (result.status === 201) {
                clean()
                fetchData()
                Swal.fire({
                    icon: 'success',
                    title: 'Tipo de Evidencia Registrada!'
                })
            } else {
                const data = await result.json()
                fetchData()
                Swal.fire({
                    icon: 'info',
                    title: data.mensaje
                })
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

module.exports.deleteTipoEvidencia = async(evidencia, fetchData) => {
    try{
        const result = await fetch(`${API}/evidencias/${evidencia.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        if(result.ok){
            if(result.status === 200){
                fetchData()
                await Swal.fire({
                    icon: 'success',
                    title: 'Tipo de Evidencia eliminada!'
                })
            }
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Ocurrio un error!',
            })
        }
    }catch (e) {
        console.error(e)
    }
}