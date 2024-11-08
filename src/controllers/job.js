const misc = require('../helpers/response')
const Job = require('../models/Job')

module.exports = {

    all: async (_, res) => {
        try {
            var jobs = await Job.all()

            var data = []

            for(i in jobs)  {
                var job = jobs[i]
                
                data.push({
                    id: job.uid, 
                    name: job.name
                })
            }

            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, false, "Server error")
        }
    },

    createOrUpdate: async (req, res) => {
        const { id, name } = req.body
        
        try {

            if(typeof id == "undefined" || id == "")
                throw new Error("id wajib diisi")

            if(typeof name == "undefined" || name == "")
                throw new Error("name wajib diisi")

            await Job.createOrUpdate(id, name)

            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e)
            misc.response(res, 400, false, "Server error")
        }
    },

    detail: async (req, res) => {
        const { id } = req.body
        
        try {

            if(typeof id == "undefined" || id == "") 
                throw new Error("id wajib diisi")

            var detail = await Job.detail(id)
            if(detail.length == 0) 
                throw new Error("Profesi tidak ditemukan")

            var data = {
                id: detail[0].uid,
                name: detail[0].name
            }

            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, false, e.message)
        }
    },

    delete: async (req, res) => {
        const { id } = req.body

        try {
            
            if(typeof id == "undefined" || id == "")
                throw new Error("id wajib diisi")

            var checkJobs = await Job.checkJobs(id)
            if(checkJobs.length == 0)
                throw new Error("Profesi tidak ditemukan")

            await Job.delete(id)

            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    }
}