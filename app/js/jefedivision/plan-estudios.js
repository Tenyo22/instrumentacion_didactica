const { default: axios } = require("axios")
const { default: apiConfig } = require("../config/apiConfig")

// const API = "http://localhost:8081"
const API = apiConfig.apiMaterias
const token = localStorage.getItem("token");


module.exports.getPlanEstudios = (setPlanEstudios) => {
    axios.get(`${API}/planestudios`)
        .then(response => {
            console.log(response.data)
            setPlanEstudios(response.data)
        }).catch(error => {
            console.log(error)
        })
}

module.exports.getPlanActualEstudios = async () => {
    const result = await fetch(`${API}/planestudios`, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })
    if (result.ok) {
        const data = await result.json()
        const planActual = data[0].clave
        // console.log(planActual)
        return { planActual }
    }
}