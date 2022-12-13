import express from 'express'

const apiRouter = express.Router()

//PUBLIC CONTROLLERS
import images from './controllers/images.js'

apiRouter.get('/images/:id?', images.getImages)
apiRouter.post('/images', images.downloadImage)

export default apiRouter