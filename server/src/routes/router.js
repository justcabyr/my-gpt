import { Router } from 'express'
import { questionController } from '../controllers/question-controller.js'
import { queryPDF, uploadPDF } from '../controllers/document-controller.js'
import { queryImage, uploadImage } from '../controllers/image-controller.js'

const router = Router()

router.route('/question').post(questionController)
router.route('/upload-pdf').post(uploadPDF)
router.route('/upload-image').post(uploadImage)
router.route('/query').post(queryPDF)
router.route('/image').post(queryImage)

export default router
