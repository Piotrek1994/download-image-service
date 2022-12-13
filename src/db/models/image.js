import mongoose from 'mongoose'

const ImageSchema = new mongoose.Schema({
    baseUrlToDownloadImage: {
        type: String,
        required: true
    },
    downloadImageDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'downloaded', 'error'],
        default: 'pending'
    },
    statusMessage: {
        type: String
    }
}, {
    timestamps: true
})

const Image = mongoose.model('image', ImageSchema)
export default Image
