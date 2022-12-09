/*
    ImageModel - findById, findOne, find, deleteOne, deleteMany, updateOne, updateMany
 */

import axios from 'axios'
import path from 'path'
import fs from 'fs'

import config from '../../config.js'
import ImageModel from '../db/models/image.js'

class Images {
    async getImages(req, res) {
        let xd = ImageModel.find()
    }

    async getImage(req, res) {
        // pobierz id z req.params
        //
        // let xd = ImageModel.findById()
    }

    async downloadImage(req, res) {
        const { linkToImage } = req.query

        if (!linkToImage) {
            res.status(400).json({
                success: false,
                code: 1,
                message: 'Link to image by query parameter must be provided.'
            })
            return
        }

        const fileName = path.basename(linkToImage)
        const image = await ImageModel.create({
            imageName: fileName,
            baseUrlToDownloadImage: linkToImage
        })

        let response
        try {
            response = await axios({
                method: 'get',
                url: linkToImage,
                responseType: 'stream'
            })

            if (response.status !== 200) {
                throw new Error()
            }
        } catch (err) {
            await image.deleteOne()
            res.status(400).json({
                success: false,
                code: 2,
                message: `Error with download image: ${err?.message || ''}.`
            })
            return
        }

        if(!config.allowedImageExtension.includes(response.headers['content-type'])) {
            await image.deleteOne()
            res.status(400).json({
                success: false,
                code: 3,
                message: 'Not allowed format image. Try again.'
            })
            return
        }

        const pathToImageSave = path.resolve('../public', `${image._id}-${fileName}`)
        const saveImage = response.data.pipe(fs.createWriteStream(pathToImageSave))

        saveImage.on('finish', async () => {
            image.downloadImageDate = new Date()
            image.isDownloaded = true

            try {
                await image.save()
                res.status(200).json({ success: true })
            } catch (err) {
                console.log(err)
                await image.deleteOne()
                res.status(400).json({
                    success: false,
                    code: 0,
                    message: `Error with saving image to DB. Try again. ${err?.message || ''}`
                })
            }
        })
    }
}

export default new Images()