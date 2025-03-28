import mongoose from 'mongoose';

//-creating schema for a user's post in 'squad yangu'
const postSchema = mongoose.Schema({
    title: String,
    message: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    likeCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
});

//-turning schema to a model
const postMessage = mongoose.model('postMessage', postSchema);

export default postMessage;