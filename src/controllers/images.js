import ImageModel from '../db/models/image.js'

class Images {
    async getImages(req, res) {
        const { id } = req.params

        if (id) {
            const image = await ImageModel.findById(id)
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
                code: 1,
                message: 'Link to image by query parameter must be provided.'
            })
            return
        }

        const image = await ImageModel.create({ baseUrlToDownloadImage: linkToImage })

        res.status(200).json({ success: true, id: image._id })
    }
}

export default new Images()