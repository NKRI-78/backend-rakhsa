require("dotenv").config()

const fs = require('fs')
const filesize = require('filesize')
const misc = require('../helpers/response')

module.exports = {

    upload: async (req, res) => {
        const { folder } = req.body

        try {

            if (typeof folder == "undefined" || folder == "")
                throw new Error("folder wajib diisi")

            if (req.files != null) {
                await fs.promises.mkdir(`${process.cwd()}/public/${folder}`, { recursive: true })
                var file = req.files.media
                var mimeType = file.mimetype
                var name = file.name.trim().split('.')[0]
                var ext = file.name.trim().split('.').pop()
                var datetime = Date.now()
                var size = filesize(file.size)
                var filename = `${name}_${datetime}.${ext}`
                file.mv(`${process.cwd()}/public/${folder}/${filename.replace(/\s/g, '')}`)
                misc.response(res, 200, false, null, {
                    path: `${process.env.BASE_URL}/${folder}/${filename.replace(/\s/g, '')}`,
                    name: name,
                    size: size,
                    mimetype: mimeType
                })
            } else {
                throw new Error("media is required")
            }

        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

}
