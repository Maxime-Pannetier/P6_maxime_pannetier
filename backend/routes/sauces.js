const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceController = require('../controller/sauces');

router.get('/', auth, sauceController.getSauce);
router.get('/:id', auth, sauceController.getSpecificSauce);
router.post('/', auth, multer, sauceController.createSauce);
router.put('/:id', auth, multer, sauceController.updateSauce);
router.delete('/:id', auth, sauceController.deleteSauce);
router.post('/:id/like', auth, sauceController.likeSauce)








module.exports=router;