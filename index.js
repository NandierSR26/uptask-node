const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
// const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
require('dotenv').config({ path: 'variables.env' });

// helpers con funciones
const helpers = require('./helpers')

// crear la conexion a la BD
const db = require('./config/db');

// importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');


db.sync()
.then( () => console.log('conectado a la DB'))
.catch( error => console.log(error))

// crear una app express
const app = express();

// donde cargar los archivos estaicos
app.use(express.static('public'));

// habilitar pug
app.set('view engine', 'pug');

// habilitar body-parser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

// agregamos expres validator a toda la aplicacion
// app.use(expressValidator());


// añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

// agregar flash messages
app.use(flash());

app.use(cookieParser())

// sesiones no permiten navegar entre distintas pagina sin volvernoa a autentivcar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// pasar vardump a la aplicacion
app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    res.locals.vardump = helpers.vardump;
    res.locals.usuario = {...req.user} || null;
    next();
})

app.use('/', routes());

// servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El servidor esta funcionando');
})

