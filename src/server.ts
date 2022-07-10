import config from "config";
import express from "express";
import bodyParser from "body-parser";
import connectDB from "../config/database";
import user from "./routes/api/user";
import salud from "./routes/api/salud";
import specialties from "./routes/api/specialities"
import medicos from "./routes/api/medico";
import pacientes from "./routes/api/pacientes"

const app = express();

connectDB()
// Express configuration
app.set("port", process.env.PORT || 3002);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//console.log("config => ", config)

// Configurar cabeceras y cors
app.use((req, res, next) => {  
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'tokens, Authorization, X-API-KEY, Origin, X-Requested-With,'+
               'Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.get('/', (req, res) => {
    // Podemos acceder a la petición HTTP
    res.status(200).json({
        status:200,
        message:"Server running successfully"
    })
});

app.use("/api/user", user);
app.use("/api/salud/consultas",salud)
app.use("/api/especialidades/consultar",specialties)
app.use("/api/medico",medicos)
app.use("/api/pacientes",pacientes)

// Una vez definidas nuestras rutas podemos iniciar el servidor
const port = app.get("port");
const server = app.listen(port, () => 
  console.log(`Server started on port ${port} - environment ${config.get("environment")}`)
);

export default server;