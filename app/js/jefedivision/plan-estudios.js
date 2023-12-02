const { default: apiConfig } = require("../config/apiConfig")

// const API = "http://localhost:8081"
const API = apiConfig.apiMaterias
const token = localStorage.getItem("token");


module.exports.getPlanEstudios = async (setPlanEstudios) => {
    try {
        const result = await fetch(`${API}/planestudios`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        if (result.ok) {
            if (result.status === 200) {
                const response = await result.json()
                setPlanEstudios(response)
            }
        }
    } catch (err) {
        console.error(err)
    }
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