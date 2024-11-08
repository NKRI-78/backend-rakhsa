const conn = require('../configs/db')

module.exports = {

  getForums: (offset, limit, userId, forumHighlightType) => {
    return new Promise ((resolve, reject) => {
      var query = `SELECT f.uid, f.caption, f.created_at, p.fullname, p.avatar, u.uid AS user_id,
        ft.name AS forum_type 
        FROM forums f
        INNER JOIN users u ON u.uid = f.user_id
        INNER JOIN profiles p ON p.user_id = u.uid
        INNER JOIN forum_types ft ON f.forum_type_id = ft.uid
        ORDER BY f.created_at DESC
        LIMIT ${offset}, ${limit}`
      if(forumHighlightType == "MOST_POPULAR") {
        query = `SELECT f.uid, f.caption, f.created_at, p.fullname, p.avatar, u.uid AS user_id,
        COUNT(fl.uid) AS likes,
        ft.name AS forum_type 
        FROM forums f
        INNER JOIN users u ON u.uid = f.user_id
        INNER JOIN profiles p ON p.user_id = u.uid
        INNER JOIN forum_types ft ON f.forum_type_id = ft.uid
        LEFT JOIN forum_likes fl ON f.uid = fl.forum_id
        GROUP BY f.uid
        ORDER BY likes DESC             
        LIMIT ${offset}, ${limit}`
      } 
      if(forumHighlightType == "SELF") {
        query = `SELECT f.uid, f.caption, f.created_at, p.fullname, p.avatar, u.uid AS user_id,
        ft.name AS forum_type 
        FROM forums f
        INNER JOIN users u ON u.uid = f.user_id
        INNER JOIN profiles p ON p.user_id = u.uid
        INNER JOIN forum_types ft ON f.forum_type_id = ft.uid
        WHERE f.user_id = '${userId}'
        LIMIT ${offset}, ${limit}`
      }
    conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  getForumTypes: (type) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT uid FROM forum_types WHERE name = '${type}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result[0].uid)
        }
      })
    })
  },

  createForum: (uid, caption, forumTypeId, userId) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO forums (uid, caption, forum_type_id, user_id) VALUES ('${uid}', '${caption}', '${forumTypeId}', '${userId}')`
        conn.query(query, (e, result) => {
          if(e) {
            reject(new Error(e))
          } else {
            resolve(result)
          }
      })
    })
  },

  createForumMedia: (uid, forumId, path) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO forum_medias (uid, forum_id, path) VALUES ('${uid}', '${forumId}', '${path}')`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  createComment: (uid, forumId, userId, comment) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO forum_comments (uid, forum_id, user_id, comment) VALUES ('${uid}', '${forumId}', '${userId}', '${comment}')`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  createReply: (uid, userId, forumId, commentId, reply) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO forum_comment_replies (uid, user_id, forum_id, comment_id, reply) VALUES ('${uid}', '${userId}', '${forumId}', '${commentId}', '${reply}')`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  deleteForum: (uid) => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM forums WHERE uid = '${uid}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  deleteComment: (uid) => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM forum_comments WHERE uid = '${uid}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else { 
          resolve(result)
        }
      })
    })
  },

  deleteReply: (uid) => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM forum_comment_replies WHERE uid = '${uid}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  getForumMedia: (forumId) => {
    return new Promise ((resolve, reject) => {
    const query = `SELECT path FROM forum_medias WHERE forum_id = '${forumId}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  getForumDetail: (forumId) =>{
    return new Promise((resolve, reject) => {
      const query = `SELECT f.uid, f.caption, f.created_at, p.fullname, p.avatar, ft.name AS forum_type 
        FROM forums f
        INNER JOIN users u ON u.uid = f.user_id
        INNER JOIN profiles p ON p.user_id = u.uid
        INNER JOIN forum_types ft ON f.forum_type_id = ft.uid
        WHERE f.uid = '${forumId}'`
        conn.query(query, (e, result) => {
          if(e) {
            reject(new Error(e))
          } else {
            resolve(result)
          }
        })
    })
  },

  getForumCommentsDetail: (forumId, offset, limit) => {
    return new Promise ((resolve, reject) => {
      const query = `SELECT c.uid, c.comment, p.fullname, p.avatar
        FROM forum_comments c
        INNER JOIN users u ON u.uid = c.user_id
        INNER JOIN profiles p ON p.user_id = u.uid
        WHERE c.forum_id = '${forumId}'
        LIMIT ${offset}, ${limit}`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  getForumComments: (forumId) => {
    return new Promise ((resolve, reject) => {
      const query = `SELECT c.uid, c.comment, p.fullname, p.avatar, u.uid AS user_id
        FROM forum_comments c
        INNER JOIN users u ON u.uid = c.user_id
        INNER JOIN profiles p ON p.user_id = u.uid
        WHERE c.forum_id = '${forumId}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  getForumLikes: (forumId) => {
    return new Promise ((resolve, reject) => {
      const query = `SELECT p.fullname, p.avatar, u.uid AS user_id
        FROM forum_likes fl
        INNER JOIN users u ON u.uid = fl.user_id
        INNER JOIN profiles p ON p.user_id = u.uid
        INNER JOIN forums f ON f.uid = fl.forum_id
        WHERE f.uid = '${forumId}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  getCommentLikes: (forumId, commentId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT fcl.uid, p.fullname, p.avatar, u.uid AS user_id 
      FROM forum_comment_likes fcl
      INNER JOIN users u ON fcl.user_id = u.uid
      INNER JOIN profiles p ON p.user_id = u.uid
      INNER JOIN forums f ON fcl.forum_id = f.uid
      INNER JOIN forum_comments fc ON fcl.comment_id = fc.uid
      WHERE f.uid = '${forumId}'
      AND fc.uid = '${commentId}'`

      console.log(query)
      
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  getCommentReplies: (forumId, commentId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT fcr.uid, fcr.reply, p.fullname, p.avatar, u.uid AS user_id 
      FROM forum_comment_replies fcr 
      INNER JOIN users u ON fcr.user_id = u.uid
      INNER JOIN profiles p ON p.user_id = u.uid
      INNER JOIN forums f ON fcr.forum_id = f.uid
      INNER JOIN forum_comments fc ON fcr.comment_id = fc.uid
      WHERE f.uid = '${forumId}'
      AND fc.uid = '${commentId}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  alreadyLikedForum: async(forumId, userId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT uid FROM forum_likes WHERE forum_id = '${forumId}' 
      AND user_id = '${userId}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  alreadyLikedComment: async(forumId, commentId, userId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT uid FROM forum_comment_likes WHERE forum_id = '${forumId}'
      AND comment_id = '${commentId}' 
      AND user_id = '${userId}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  likeForum: async(uid, forumId, userId) => { 
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO forum_likes (uid, forum_id, user_id) VALUES ('${uid}', '${forumId}', '${userId}')`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  likeComment: async(uid, forumId, commentId, userId) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO forum_comment_likes (uid, forum_id, comment_id, user_id) VALUES ('${uid}', '${forumId}', '${commentId}', '${userId}')`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  dislikeForum: async(uid) => { 
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM forum_likes WHERE uid = '${uid}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },  

  dislikeComment: async(uid) => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM forum_comment_likes WHERE uid = '${uid}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  }
  
}

