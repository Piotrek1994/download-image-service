import ImageModel from '../db/models/image.js'
import { mongo } from 'mongoose'

class Images {
    async getImages(req, res) {
        const { id } = req.params

        if (id) {
            let imageId

            try {
                imageId = new mongo.ObjectId(id)
            } catch (err) {
                res.status(400).json({
                    success: false,
                    code: 0,
                    message: 'Invalid ID format.'
                })
                return
            }

            const image = await ImageModel.findById(imageId)

            if (!image) {
                res.status(400).json({
                    success: false,
                    code: 1,
                    message: 'Image with provided ID does not exist.'
                })
                return
            }

            if (image.status !== 'downloaded') {
                res.status(200).json({
                    success: true,
                    data: {
                        status: image.status,
                        message: image?.statusMessage
                    }
                })
                return
            }

            res.status(200).json({ success: true, data: image })
            return
        }

        const images = await ImageModel.find()

        res.status(200).json({ success: true, data: images })
    }

    async downloadImage(req, res) {
        const { linkToImage } = req.query

        if (!linkToImage) {
            res.status(400).json({
                success: false,
                code: 2,
                message: 'Link to image by query parameter must be provided.'
            })
            return
        }

        const image = await ImageModel.create({ baseUrlToDownloadImage: linkToImage })

        res.status(200).json({
            success: true,
            data: {
                id: image._id,
                checkImage: `http://localhost:3001/api/v1/images/${image._id}`
            }
        })
    }
}

export default new Images()