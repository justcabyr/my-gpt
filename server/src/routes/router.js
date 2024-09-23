import { Router } from 'express'
import { questionController } from '../controllers/question-controller.js'
import { queryPDF, uploadPDF } from '../controllers/document-controller.js'

const router = Router()

router.route('/question').post(questionController)
router.route('/upload').post(uploadPDF)
router.route('/query').post(queryPDF)

export default router
