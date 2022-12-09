import mongoose from 'mongoose'

const ImageSchema = new mongoose.Schema({
    imageName: {
        type: String
    },
    baseUrlToDownloadImage: {
        type: String
    },
    downloadImageDate: {
        type: Date
    },
    isDownloaded: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})

const Image = mongoose.model('image', ImageSchema)
export default Image