import express from 'express'

const apiRouter = express.Router()

// PUBLIC CONTROLLERS
import images from './controllers/images.js'

apiRouter.get('/images/', images.getImages)
apiRouter.get('/images/:id', images.getImage)
apiRouter.post('/images', images.downloadImage)

export default apiRouter
