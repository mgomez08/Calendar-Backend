const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const registerUser = async(req, res = response) => {

    const { email, password } = req.body;
 
    try {
        let user = await User.findOne({ email });
        if( user ){
            return res.status(400).json({
                ok: false,
                msg: 'Ya hay un usuario registrado con este correo.'
            });
        }
        user = new User( req.body);
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();
    
        //Generar JWT
        const token = await generateJWT(user.id, user.name);

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        }) 

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error al registrarse, inténtelo de nuevo.',
        }) 
    }
}

const loginUser = async(req, res = response) => {
    const { email, password } = req.body;

    try{
        const user = await User.findOne({ email });
        if( !user ){
            return res.status(400).json({
                ok: false,
                msg: 'Email o contraseña incorrectos',
            });
        }

        const validPassword = bcrypt.compareSync( password, user.password );

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Email o contraseña incorrectos',
            });
        }

        const token = await generateJWT(user.id, user.name);

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        }) 

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error al registrarse, inténtelo de nuevo.',
        }) 
    }
}

const refreshToken = async(req, res = response) => {

    const {uid, name} = req

    const token = await generateJWT(uid, name);

    res.json({
        ok: true,
        token,
        uid,
        name
    })

}

module.exports = {
    registerUser,
    loginUser,
    refreshToken,
}