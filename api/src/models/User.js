const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    username:           { type: String, required: true, unique: true },
    email:              { type: String, required: true, unique: true },
    passwordHash:       { type: String, required: true },
    role:               { type: String, required: true },   // role (admin/user/banned)
    dni:                { type: Number },
    firstname:          { type: String },
    lastname:           { type: String },
    birthday:           { type: String },
    phone:              { type: String },
    location:           { type: Object },                   // country {country: , city: , state: }
    address:            { type: Object },                   // address {street address: , floor: , department: , zip code: }
    products:           { type: Array },                    // [ products (status: in sale, sold, paused) ]
    reports:            { type: Array },                    // users can report others { gravity: 1-5, description: 'bla', username: 'user' }
    favorites:          [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

// validar atributos 'unique'
    userSchema.plugin(uniqueValidator);

// eliminar _id y __v al devolverlos de la database
    userSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString();
            delete returnedObject._id;
            delete returnedObject.__v;
            delete returnedObject.passwordHash;  // no revelar passwordHash
        }
    });

const User = mongoose.model('User', userSchema);

module.exports = User;