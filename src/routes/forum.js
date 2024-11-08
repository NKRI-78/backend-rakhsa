const express = require("express")
const Route = express.Router()
const forum = require("../controllers/forum")

// FORUM
Route.get("/", forum.getForums)
Route.post("/", forum.createForum)
Route.post("/media", forum.createForumMedia)
Route.get("/:forum_id", forum.getForumDetail)
Route.post("/like", forum.toggleLikeForum)
Route.get("/delete/:forum_id", forum.deleteForum)

// FORUM COMMENT
Route.post("/comment", forum.createComment)
Route.post("/comment/like", forum.toggleLikeComment)
Route.get("/comment/delete/:comment_id", forum.deleteComment)

// FORUM REPLY
Route.post("/reply", forum.createReply)
Route.get("/reply/delete/:reply_id", forum.deleteReply)

module.exports = Route