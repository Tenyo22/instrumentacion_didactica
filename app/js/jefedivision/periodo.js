const { default: axios } = require("axios");
const { default: apiConfig } = require("../config/apiConfig");

// const API = "http://localhost:8081"
const API = apiConfig.apiMaterias
const token = localStorage.getItem("token");
const config = {
    headers: {
        'Authorization': 'Bearer ' + token
    }
}

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