import Cookies from "js-cookie";

const { jwtDecode } = require("jwt-decode");
const { default: apiConfig } = require("../config/apiConfig");

// const API = "http://localhost:8081"
const API = apiConfig.apiMaterias
// const token = localStorage.hasOwnProperty("token") ? localStorage.getItem("token") : "none";
const token = Cookies?.get("token") || "none";

module.exports.token = (token) => {
    Cookies.set("token", token)

    var decodedToken = jwtDecode(token)
    // console.log(decodedToken)
    if (decodedToken.role[0].authority === "ROLE_ADMINISTRADOR") {
        // console.log("Administrador")
        window.location = "/jefedivision"
    } else if (decodedToken.role[0].authority === "DOCENTE") {
        window.location = "/docente"
    } else {
        window.location = "/invitado"
    }
    // localStorage.setItem("token", response.data.token)
}

module.exports.user = (setUser) => {
    // var decodedToken = jwtDecode(localStorage.getItem("token"))
    var decodedToken = jwtDecode(Cookies.get("token"))
    setUser(decodedToken.sub)
}

module.exports.getId = () => {
    // var decodedToken = jwtDecode(localStorage.getItem("token"))
    var decodedToken = jwtDecode(Cookies.get("token"))
    return decodedToken.id
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
        if (result.status === 401) {
            // console.log(result.status)
            Cookies.delete('token')
            // localStorage.removeItem('token')
            window.location = "/"
        }
    } catch (err) {
        console.log(err)
    }
}

module.exports.deleteToken = () => {
    Cookies.remove("token")
    window.location = '/'
}