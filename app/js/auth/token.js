const { jwtDecode } = require("jwt-decode");
const { default: apiConfig } = require("../config/apiConfig");

// const API = "http://localhost:8081"
const API = apiConfig.apiMaterias
const token = localStorage.hasOwnProperty("token") ? localStorage.getItem("token") : "none";
const config = {
    headers: {
        'Authorization': 'Bearer ' + token
    }
}

module.exports.token = (token) => {
    // var token = response.data.token

    // console.log(token)
    localStorage.setItem("token", token)
    var decodedToken = jwtDecode(token)
    // console.log(decodedToken)
    if (decodedToken.role[0].authority === "ROLE_ADMINISTRADOR") {
        // console.log("Administrador")
        window.location = "/jefedivision"
    } else {
        window.location = "/docente"
    }
    // localStorage.setItem("token", response.data.token)
}

module.exports.user = (setUser) => {
    var decodedToken = jwtDecode(localStorage.getItem("token"))
    setUser(decodedToken.sub)
}

module.exports.validateToken = () => {
    if (token.includes("none")) {
        window.location = "/"
    }
}

module.exports.validateTokenAPI = async () => {
    try {
        const result = await fetch(`${API}/periodo/validate-token`, {
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        })
        if(result.status === 401) {
            // console.log(result.status)
            localStorage.removeItem('token')
            window.location = "/"
        }
    } catch (err) {
        console.log(err)
    }
}

module.exports.deleteToken = () => {
    localStorage.removeItem("token")
    window.location = '/'
}