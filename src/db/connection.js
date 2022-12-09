import mongoose from 'mongoose'
import config from '../../config.js'

const connectToDatabase = async () => {
    try {
        mongoose.set('strictQuery', true)
        await mongoose.connect(config.dbUrl)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

export default connectToDatabase