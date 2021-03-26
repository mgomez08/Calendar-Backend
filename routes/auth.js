/*
    Rutas de Usuarios /auth
    host + /api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { registerUser, loginUser, refreshToken, } = require('../controllers/auth');
const { validFields } = require('../middlewares/fields-validator');
const { validateJWT } = require('../middlewares/valid-jwt');

router.post(
    '/register',
     [//middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 carácteres').isLength({min: 6}),
        validFields
     ] 
    ,registerUser);
    
router.post(
    '/',
    [
        check('email', 'El email es obligatorio').not().isEmpty(),
        check('email', 'El email debe ser valido').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validFields
    ],
     loginUser);

router.get('/refreshToken', validateJWT, refreshToken);

module.exports = router;