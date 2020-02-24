require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

//Home endpoint
app.route('/')
    .get((req, res) => {
        res.status(200).json('Template Project')
    })

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