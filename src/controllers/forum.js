const Forum = require("../models/Forum")
const misc = require('../helpers/response')
const { v4: uuidv4 } = require('uuid')

module.exports = {

    getForums: async (req, res) => {
        var results = []

        var forumHighlightType = req.query.forum_highlight_type || "MOST_RECENT"
        var userId = req.header("USERID")
        var page = parseInt(req.query.page) || 1
        var limit = parseInt(req.query.limit) || 20
        var offset = (page - 1) * limit

        try {
            var forums = await Forum.getForums(offset, limit, userId, forumHighlightType)

            var resultTotal = forums.length
            var prevPage = page === 1 ? 1 : page - 1
            var nextPage = page === limit ? 1 : page + 1

            var pageDetail = {
                total: resultTotal,
                per_page: limit,
                next_page: nextPage,
                prev_page: prevPage,
                current_page: page,
                next_url: `${process.env.BASE_URL}${req.originalUrl.replace("page=" + page, "page=" + nextPage)}`,
                prev_url: `${process.env.BASE_URL}${req.originalUrl.replace("page=" + page, "page=" + prevPage)}`
            }

            for (var i in forums) {
                var forum = forums[i]
                var forumMedia = await Forum.getForumMedia(forum.uid)
                var forumComments = await Forum.getForumComments(forum.uid)
                var forumLikes = await Forum.getForumLikes(forum.uid)

                var comments = []
                for (var z in forumComments) {
                    var comment = forumComments[z]
                    var forumCommentLikes = await Forum.getCommentLikes(forum.uid, comment.uid)
                    var forumCommentReplies = await Forum.getCommentReplies(forum.uid, comment.uid)

                    var commentLikes = []
                    for (var k in forumCommentLikes) {
                        var commentLike = forumCommentLikes[k]
                        commentLikes.push({
                            uid: commentLike.uid,
                            user: {
                                uid: commentLike.user_id,
                                avatar: commentLike.avatar,
                                name: commentLike.fullname
                            }
                        })
                    }

                    var commentReplies = []
                    for (var l in forumCommentReplies) {
                        var commentReply = forumCommentReplies[l]
                        commentReplies.push({
                            uid: commentReply.uid,
                            reply: commentReply.reply,
                            user: {
                                uid: commentReply.user_id,
                                avatar: commentReply.avatar,
                                name: commentReply.fullname
                            }
                        })
                    }

                    comments.push({
                        uid: comment.uid,
                        comment: comment.comment,
                        comment_likes: {
                            total: forumCommentLikes.length,
                            likes: commentLikes
                        },
                        comment_replies: {
                            total: forumCommentReplies.length,
                            replies: commentReplies
                        },
                        user: {
                            uid: comment.user_id,
                            avatar: comment.avatar,
                            name: comment.fullname
                        }
                    })
                }

                var likes = []
                for (var z in forumLikes) {
                    var like = forumLikes[z]
                    likes.push({
                        user: {
                            uid: like.user_id,
                            avatar: like.avatar,
                            name: like.fullname
                        }
                    })
                }
                results.push({
                    uid: forum.uid,
                    caption: forum.caption,
                    media: forumMedia,
                    user: {
                        uid: forum.user_id,
                        avatar: forum.avatar,
                        name: forum.fullname
                    },
                    forum_comments: {
                        total: comments.length,
                        comments: comments
                    },
                    forum_likes: {
                        total: forumLikes.length,
                        likes: likes
                    },
                    forum_type: forum.forum_type,
                    created_at: forum.created_at
                })
            }

            misc.responsePagination(res, 200, false, null, pageDetail, results)
        } catch (e) {
            console.log(e) // in-development
            misc.response(res, 400, true, "Server error")
        }
    },

    getForumDetail: async (req, res) => {
        var forumId = req.params.forum_id

        var page = parseInt(req.query.comment_page) || 1
        var limit = parseInt(req.query.limit) || 10
        var offset = (page - 1) * limit

        var results = []

        try {
            var forums = await Forum.getForumDetail(forumId)

            for (var i in forums) {
                var forum = forums[i]
                var forumMedia = await Forum.getForumMedia(forum.uid)
                var forumComments = await Forum.getForumCommentsDetail(forum.uid, offset, limit)
                var forumLikes = await Forum.getForumLikes(forum.uid)

                var resultTotal = forumComments.length

                var prevPage = page === 1 ? 1 : page - 1
                var nextPage = page === limit ? 1 : page + 1

                var pageDetail = {
                    total: resultTotal,
                    per_page: limit,
                    next_page: nextPage,
                    prev_page: prevPage,
                    current_page: page,
                    next_url: `${process.env.BASE_URL}${req.originalUrl.replace("page=" + page, "page=" + nextPage)}`,
                    prev_url: `${process.env.BASE_URL}${req.originalUrl.replace("page=" + page, "page=" + prevPage)}`
                }

                var forumLikes = await Forum.getForumLikes(forum.uid)

                var comments = []
                for (var z in forumComments) {
                    var comment = forumComments[z]
                    var forumCommentLikes = await Forum.getCommentLikes(forum.uid, comment.uid)
                    var forumCommentReplies = await Forum.getCommentReplies(forum.uid, comment.uid)

                    var commentLikes = []
                    for (var k in forumCommentLikes) {
                        var commentLike = forumCommentLikes[k]
                        commentLikes.push({
                            uid: commentLike.uid,
                            user: {
                                uid: commentLike.user_id,
                                avatar: commentLike.avatar,
                                name: commentLike.fullname
                            }
                        })
                    }

                    var commentReplies = []
                    for (var l in forumCommentReplies) {
                        var commentReply = forumCommentReplies[l]
                        commentReplies.push({
                            uid: commentReply.uid,
                            reply: commentReply.reply,
                            user: {
                                uid: commentReply.user_id,
                                avatar: commentReply.avatar,
                                name: commentReply.fullname
                            }
                        })
                    }

                    comments.push({
                        uid: comment.uid,
                        comment: comment.comment,
                        comment_likes: {
                            total: forumCommentLikes.length,
                            likes: commentLikes
                        },
                        comment_replies: {
                            total: forumCommentReplies.length,
                            replies: commentReplies
                        },
                        user: {
                            uid: comment.user_id,
                            avatar: comment.avatar,
                            name: comment.fullname
                        }
                    })
                }

                var likes = []
                for (var z in forumLikes) {
                    var like = forumLikes[z]
                    likes.push({
                        user: {
                            uid: like.uid,
                            avatar: like.avatar,
                            name: like.fullname
                        }
                    })
                }
                results.push({
                    uid: forum.uid,
                    caption: forum.caption,
                    media: forumMedia,
                    user: {
                        avatar: forum.avatar,
                        name: forum.fullname
                    },
                    forum_comments: {
                        total: comments.length,
                        comments: comments
                    },
                    forum_likes: {
                        total: forumLikes.length,
                        likes: likes
                    },
                    forum_type: forum.forum_type,
                    created_at: forum.created_at
                })
            }
            res.status(200).json({
                status: 200,
                error: false,
                message: "Ok",
                comment_paginate: pageDetail,
                data: results[0]
            })
        } catch (e) {
            console.log(e) // in-development
            misc.response(res, 400, true, "Server error")
        }
    },

    createForumMedia: async (req, res) => {
        var uid = uuidv4()

        const { forum_id, path } = req.body

        try {
            await Forum.createForumMedia(uid, forum_id, path)
            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e) // in-development
            misc.response(res, 400, true, e.message)
        }
    },

    createForum: async (req, res) => {
        const { forum_id, caption, forum_type, user_id } = req.body

        var forumTypes = ["text", "image", "video", "document"]

        try {

            if (typeof caption == "undefined" || caption == "")
                throw new Error("caption wajib diisi")

            if (typeof forum_type == "undefined" || forum_type == "")
                throw new Error("forum_type wajib diisi")

            if (typeof user_id == "undefined" || user_id == "")
                throw new Error("user_id wajib diisi")

            if (!forumTypes.includes(forum_type))
                throw new Error("forum_type wajib diisi")

            var forumTypeId = await Forum.getForumTypes(forum_type)

            await Forum.createForum(forum_id, caption, forumTypeId, user_id)

            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e) // in-development
            misc.response(res, 400, true, e.message)
        }
    },

    createComment: async (req, res) => {
        var uid = uuidv4()

        const { forum_id, user_id, comment } = req.body

        try {

            if (typeof forum_id == "undefined" || forum_id == "")
                throw new Error("forum_id wajib diisi")

            if (typeof user_id == "undefined" || user_id == "")
                throw new Error("user_id wajib diisi")

            if (typeof comment == "undefined" || comment == "")
                throw new Error("comment wajib diisi")

            await Forum.createComment(uid, forum_id, user_id, comment)
            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e) // in-development
            misc.response(res, 400, true, e.message)
        }
    },

    createReply: async (req, res) => {
        var uid = uuidv4()

        var userId = req.body.user_id
        var forumId = req.body.forum_id
        var commentId = req.body.comment_id
        var reply = req.body.reply

        try {
            if (typeof userId == "undefined" || userId == "")
                throw new Error("user_id wajib diisi")

            if (typeof forumId == "undefined" || forumId == "")
                throw new Error("forum_id wajib diisi")

            if (typeof commentId == "undefined" || commentId == "")
                throw new Error("comment_id wajib diisi")

            if (typeof reply == "undefined" || reply == "")
                throw new Error("reply wajib diisi")

            await Forum.createReply(uid, userId, forumId, commentId, reply)
            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e) // in-development
            misc.response(res, 400, true, e.message)
        }
    },

    deleteForum: async (req, res) => {
        var forumId = req.params.forum_id

        try {

            if (typeof forumId == "undefined" || forumId == "")
                throw new Error("forum_id wajib diisi")

            await Forum.deleteForum(forumId)
            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e) // in-development
            misc.response(res, 400, true, e.message)
        }
    },

    deleteComment: async (req, res) => {
        var commentId = req.params.comment_id

        try {

            if (typeof commentId == "undefined" || commentId == "")
                throw new Error("comment_id wajib diisi")

            await Forum.deleteComment(commentId)
            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e) // in-development
            misc.response(res, 400, true, e.message)
        }
    },

    deleteReply: async (req, res) => {
        var replyId = req.params.reply_id

        try {

            if (typeof replyId == "undefined" || replyId == "")
                throw new Error("reply_id wajib diisi")

            await Forum.deleteReply(replyId)
            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e) // in-development
            misc.response(res, 400, true, e.message)
        }
    },

    toggleLikeForum: async (req, res) => {
        var uid = uuidv4()

        var forumId = req.body.forum_id
        var userId = req.body.user_id

        try {
            if (typeof forumId == "undefined" || forumId == "")
                throw new Error("forum_id wajib diisi")

            if (typeof userId == "undefined" || userId == "")
                throw new Error("user_id wajib diisi")

            var alreadyLikedForum = await Forum.alreadyLikedForum(forumId, userId)
            if (alreadyLikedForum.length != 0) {
                await Forum.dislikeForum(alreadyLikedForum[0].uid)
                misc.response(res, 200, false, "Forum tidak disukai")
            } else {
                await Forum.likeForum(uid, forumId, userId)
                misc.response(res, 200, false, "Forum telah disukai")
            }
        } catch (e) {
            console.log(e) // in-development
            misc.response(res, 400, true, e.message)
        }
    },

    toggleLikeComment: async (req, res) => {
        var uid = uuidv4()

        var forumId = req.body.forum_id
        var commentId = req.body.comment_id
        var userId = req.body.user_id

        try {
            if (typeof forumId == "undefined")
                throw new Error("forum_id wajib diisi")

            if (typeof commentId == "undefined")
                throw new Error("comment_id wajib diisi")

            if (typeof userId == "undefined")
                throw new Error("user_id wajib diisi")

            var alreadyLikedComment = await Forum.alreadyLikedComment(forumId, commentId, userId)
            if (alreadyLikedComment.length != 0) {
                await Forum.dislikeComment(alreadyLikedComment[0].uid)
                misc.response(res, 200, false, "Komentar tidak disukai")
            } else {
                await Forum.likeComment(uid, forumId, commentId, userId)
                misc.response(res, 200, false, "Komentar telah disukai")
            }
        } catch (e) {
            console.log(e) // in-development
            misc.response(res, 400, true, e.message)
        }
    }
}