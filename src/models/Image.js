const { Schema, model } = require('mongoose');

const imageSchema = new Schema({
    uploader: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { 
        type: String,
        required: true 
    },
    description: { 
        type: String 
    },
    filename: { 
        type: String,
        required: true 
    },
    path: { 
        type: String, 
        required: true 
    },
    originalName: { 
        type: String 
    },
    mimetype: { 
        type: String 
    },
    size: { 
        type: Number 
    },
    created_at: { 
        type: Date, 
        default: Date.now(),
        required: true
    }
});

module.exports = model('Image', imageSchema);