const uuid = require('uuid').v4;
const UserModel = require('../models/UserModel');
const PostModel = require('../models/PostModel');
const {
  newLikeNotification,
  removeLikeNotification,
  newCommentNotification,
  removeCommentNotification,
} = require('./notificationActions');

const likeOrUnlikePost = async (postId, userId, like) => {
  try {
    const post = await PostModel.findById(postId);

    if (!post) return { error: 'No post found' };

    if (like) {
      const isLiked =
        post.likes.filter((like) => like.user.toString() === userId).length > 0;

      if (isLiked) return { error: 'Post liked before' };

      await post.likes.unshift({ user: userId });

      await post.save();

      if (post.user.toString() !== userId) {
        await newLikeNotification(userId, postId, post.user.toString());
      }
    }
    //
    else {
      const isLiked =
        post.likes.filter((like) => like.user.toString() === userId).length ===
        0;

      if (isLiked) return { error: 'Post not liked before' };

      const indexOf = post.likes
        .map((like) => like.user.toString())
        .indexOf(userId);

      await post.likes.splice(indexOf, 1);

      await post.save();

      if (post.user.toString() !== userId) {
        await removeLikeNotification(userId, postId, post.user.toString());
      }
    }

    const user = await UserModel.findById(userId);

    const { name, profilePicUrl, username } = user;

    return {
      success: true,
      name,
      profilePicUrl,
      username,
      postByUserId: post.user.toString(),
    };
  } catch (error) {
    return { error: 'Server error' };
  }
};

const commentPost = async (postId, userId, text) => {
  try {
    if (text.length < 1)
      return { error: 'Comment should be atleast 1 character' };

    const post = await PostModel.findById(postId);

    if (!post) return { error: 'No post found' };

    const newComment = {
      _id: uuid(),
      user: userId,
      text,
      date: Date.now(),
    };

    await post.comments.unshift(newComment);
    await post.save();

    if (post.user.toString() !== userId) {
      await newCommentNotification(
        postId,
        newComment._id,
        userId,
        post.user.toString(),
        text
      );
    }

    // Return to socket
    const user = await UserModel.findById(userId);

    const { name, profilePicUrl, username } = user;

    return {
      success: true,
      commentId: newComment._id,
      name,
      profilePicUrl,
      username,
      postByUserId: post.user.toString(),
    };
  } catch (error) {
    return { error: 'Server error' };
  }
};

module.exports = { likeOrUnlikePost, commentPost };
