const { response } = require('express');
const Event = require('../models/Event')

const getEvents = async(req, res = response) => {
    const events = await Event.find().populate('user', 'name');
    try {
        res.status(201).json({
            ok: true,
            events
        }) 
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error al obtener los eventos, inténtelo de nuevo.',
        }) 
    }
}
const newEvent = async(req, res = response) => {
    const event = new Event( req.body );
    try {
        event.user = req.uid;
        const eventSave = await event.save();
        res.status(201).json({
            ok: true,
            event: eventSave,
        }) 
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error al crear un nuevo evento, inténtelo de nuevo.',
        }) 
    }
}
const updateEvent = async(req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event  = await Event.findById(eventId);
        if( !event ){
            return res.status(404).json({
                ok: false,
                msg: 'El id del evento a actuliazar es incorrecto, inténtelo de nuevo.'
            })
        }
        if( event.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento.'
            })
        }
        const newDataEvent = {
            ...req.body,
            user: uid,
        }
        const updatedEvent = await Event.findByIdAndUpdate(eventId, newDataEvent, {new: true});
        res.status(201).json({
            ok: true,
            updatedEvent,
        }) 
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error, inténtelo de nuevo.',
        }) 
    }
}
const deleteEvent = async(req, res = response) => {
    const eventId = req.params.id;
    const uid = req.uid;
    try {
        const event  = await Event.findById(eventId);
        if( !event ){
            return res.status(404).json({
                ok: false,
                msg: 'El id del evento a eliminar es incorrecto, inténtelo de nuevo.'
            })
        }
        if( event.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento.'
            })
        }
        await Event.findByIdAndDelete(eventId);
        res.status(201).json({
            ok: true,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error, inténtelo de nuevo.',
        }) 
    }
}


module.exports = {
    getEvents,
    newEvent,
    updateEvent,
    deleteEvent
}