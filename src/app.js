require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const logger = require('./logger')

const app = express()
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common'

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())


//DB CONNECTION
mongoose.connect(
    process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connection to DB established.")
    })
    .catch(error => {
        connectionErrorHandler(error)
    })

mongoose.connection.on('error', error => connectionErrorHandler(error))

function connectionErrorHandler(error) {
    console.log('Error: ', error.message)
}



//SECURITY HANDLE MIDDLEWARE
function handleAccessSecurity(req, res, next) {
    const apiKey = req.get('authorization')

    //avoid apiKey on home ('/') or about ('/about') paths
    if(req.path === '/' || req.path === '/about') {
        next()
    }
    else if (!apiKey || apiKey.split(' ')[1] !== process.env.API_KEY) { //mandatory apiKey for the rest of the paths
        logger.error(`Unauthorized request to path: ${req.path}`)
        next({ status: '401', message: 'Unauthorized request' })
    }

    next()
}
app.use(handleAccessSecurity)



//HOME ENDPOINT
app.route('/')
    .get((req, res) => {
        res.status(200).json('Template Project')
    })

//MODEL ENDPOINT
//app.route(modelRouter)



//Error Handling middleware
function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = {
            error: { message: "server error", status: 500 }
        }
    }
    else {
        response = {
            error: { message: error.message, status: error.status ? error.status: 500 }
        }
    }

    res.status(response.error.status).json(response);
}
app.use(errorHandler)


module.exports = app