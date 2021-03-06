require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const accessHandler = require('./access-handler')
const { NODE_ENV } = require('./config')
const logger = require('./logger')
const errorHandler = require('./error-handler')

const app = express()
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common'

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())

//SECURITY HANDLE MIDDLEWARE
app.use(accessHandler)



//HOME ENDPOINT
app.route('/')
    .get((req, res) => {
        res.status(200).json('Template Project')
    })

//MODEL ENDPOINT
//app.route(modelRouter)



app.use(errorHandler)


module.exports = app