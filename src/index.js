import express from 'express'
import path from 'path'
import fs from 'fs'

import config from '../config.js'
import apiRouter from './apiRouter.js'
import connectToDatabase from './db/connection.js'

if (!fs.existsSync(path.resolve('../public'))) {
    fs.mkdirSync('../public')
}

connectToDatabase().then(() => {
    const app = express()

    app.use(express.json())

    app.use('/api/v1', apiRouter)

    app.listen(config.port, () => console.log(`Server started on port ${config.port}`))
})