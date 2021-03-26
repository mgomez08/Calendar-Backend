const { Router } = require('express');
const { check } = require('express-validator');
const { getEvents, newEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { validateJWT } = require('../middlewares/valid-jwt');
const { validFields } = require('../middlewares/fields-validator');
const { isDate } = require('../helpers/isDate');

const router = Router();

router.use( validateJWT );


//EndPoint for get Events
router.get('/', getEvents);

//EndPoint for create a new Event
router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio.').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria.').custom(isDate),
        check('end', 'La fecha de finalización es obligatoria.').custom(isDate),
        validFields
    ],
     newEvent
);

//EndPoint for update an Event
router.put(
    '/:id',
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','La fecha de inicio es obligatoria').custom( isDate ),
        check('end','La fecha de finalización es obligatoria').custom( isDate ),
        validFields
    ]
    , updateEvent
);

//EndPoint for update an Event
router.delete('/:id', deleteEvent);

module.exports = router;