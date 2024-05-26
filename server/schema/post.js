import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        comment: {
            type: String
        }
    }],
    caption: {
        type: String,
        //maxLength: 55
        //required: true
    },
    location: {
        type: String
    },
    isRoamioTrip: {
        type: Boolean,
        default: false
    },
    postImage: [{
        type: String,
        //required: true
    }]
}
,{timestamps: true});

const Post = mongoose.model('post', postSchema);

export default Post;
