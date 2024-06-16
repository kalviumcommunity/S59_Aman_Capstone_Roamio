import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "createdBy is required"],
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comment: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        comment: {
          type: String,
          required: [true, "Comment is requires."],
        },
      },
    ],
    caption: {
      type: String,
      maxlength: [55, "Caption can not exceed 55 characters."],
    },
    isPublicPost: {
      type: Boolean,
      default: true,
    },
    location: {
      type: String,
    },
    isRoamioTrip: {
      type: Boolean,
      default: false,
    },
    postImage: [
      {
        type: String,
        required: [true, "PostImage is required"],
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Post = mongoose.model("Post", postSchema);

export default Post;
// {
//     "createdBy": "60cb49e7391fe50015b6f104", // ObjectId of the user who created the post
//     "collaborators": ["60cb49e7391fe50015b6f105", "60cb49e7391fe50015b6f106"], // Array of ObjectId's of collaborators (if any)
//     "likes": ["60cb49e7391fe50015b6f107", "60cb49e7391fe50015b6f108"], // Array of ObjectId's of users who liked the post (if any)
//     "comments": [
//         {
//             "userId": "60cb49e7391fe50015b6f109", // ObjectId of the user who commented
//             "comment": "Great post!" // Comment text
//         },
//         {
//             "userId": "60cb49e7391fe50015b6f10a",
//             "comment": "Amazing!"
//         }
//     ],
//     "caption": "Beautiful sunset view", // Caption text
//     "location": "Beach", // Location where the post was taken (optional)
//     "isRoamioTrip": false, // Boolean indicating if it's a Roamio trip
//     "postImage": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"] // Array of image URLs
// }
