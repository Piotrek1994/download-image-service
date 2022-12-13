import  express from 'express'
import fs from 'fs'
import path from 'path'
import axios from 'axios'

import config from '../config.js'
import apiRouter from './apiRouter.js'
import connectToDatabase from './db/connection.js'
import ImageModel from './db/models/image.js'

if (!fs.existsSync(path.resolve('../public'))) {
    fs.mkdirSync(`../public`)
}

connectToDatabase().then(() => {
    const app = express()

    app.use(express.json())

    app.use('/api/v1', apiRouter)

    app.listen(config.port, () => console.log(`Server started on port ${config.port}`))
    processNext()
})

async function processNext() {
    const images = await ImageModel.find({ status: 'pending' }).sort({ createdAt: -1 }).limit(1)

    if (images.length === 0) {
        setTimeout(processNext, 2000)
        return
    }

    await downloadImage(images[0])
    processNext()
}

async function downloadImage(image) {
    let response
    try {
        response = await axios({
            method: 'get',
            url: image.baseUrlToDownloadImage,
            responseType: 'stream'
        })

        if (response.status !== 200) {
            throw new Error('non-200 status code returned')
        }
    } catch (err) {
        image.status = 'error'
        image.statusMessage = err.message
        await image.save()
        return
    }

    const mimeType = response.headers['content-type']

    if (!config.allowedMimeTypes.includes(mimeType)) {
        image.status = 'error'
        image.statusMessage = 'Not allowed mime type'
        await image.save()
        return
    }

    const extension = mimeType.split('/')[1]

    const pathToImageSave = path.resolve(`../public`, `${image._id}.${extension}`)
    const saveImage = response.data.pipe(fs.createWriteStream(pathToImageSave))

    saveImage.on('finish', async () => {
        image.downloadImageDate = new Date()
        image.status = 'downloaded'
        await image.save()
    })

    saveImage.on('error', async () => {
        image.status = 'error'
        image.statusMessage = 'Failed to download'
        await image.save()
    })
}