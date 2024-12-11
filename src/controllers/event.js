
const misc = require("../helpers/response")
const utils = require("../helpers/utils")
const Event = require("../models/Event")
const User = require("../models/User")

module.exports = {

    list: async (_, res) => {
        try {

            var events = await Event.list()

            var data = []

            for (const i in events) {
                var event = events[i]

                var users = await User.getUser(event.user_id)

                console.log(users)

                data.push({
                    id: event.id,
                    title: event.title, 
                    description: event.description,
                    state: event.state_name, 
                    continent: event.continent_name,
                    start_day: utils.fday(event.start_date),
                    end_day: utils.fday(event.end_date),
                    start_date: utils.formatDateByName(event.start_date), 
                    end_date: utils.formatDateByName(event.end_date), 
                    user: {
                        id: users.length == 0 ?  "_" : users[0].user_id,
                        name: users.length == 0 ?  "_" : users[0].username, 
                    }
                })
            }

            misc.response(res, 200, false, "", data)             
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, "", null)
        }
    },

    listEventUser: async (req, res) => {
        
        const { user_id } = req.body

        try {

            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("Field user_id is required")

            var events = await Event.listEventUser(user_id)

            var data = []

            for (const i in events) {
                var event = events[i]

                var users = await User.getUser(event.user_id)

                data.push({
                    id: event.id,
                    title: event.title, 
                    description: event.description,
                    state: event.state_name, 
                    continent: event.continent_name,
                    start_day: utils.fday(event.start_date),
                    end_day: utils.fday(event.end_date),
                    start_date: utils.formatDateByName(event.start_date), 
                    end_date: utils.formatDateByName(event.end_date), 
                    user: {
                        id: users[0].user_id,
                        name: users[0].username, 
                    }
                })
            }

            misc.response(res, 200, false, "", data)             
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, "", null)
        }
    },

    detail: async (req, res) => {
        const { id } = req.params

        try {

           if(id == ":id" || id == "") 
                throw new Error("Param id is required")

            var events = await Event.find(id)

            if(events.length == 0)
                throw new Error("Event not found")

            var event = events[0]

            var users = await User.getUser(event.user_id)

            var data = {
                id: event.id,
                title: event.title, 
                description: event.description,
                state_id: event.state_id,
                state: event.state_name, 
                continent_id: event.continent_id,
                continent: event.continent_name,
                start_day: utils.fday(event.start_date),
                end_day: utils.fday(event.end_date),
                start_date: utils.formatDateByName(event.start_date), 
                end_date: utils.formatDateByName(event.end_date), 
                start_date_unformatted: event.start_date,
                end_date_unformatted: event.end_date,
                user: {
                    id: users[0].user_id,
                    name: users[0].username, 
                }
            }

            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, "", null)
        }
    },

    store: async (req, res) => {

        const { 
            title, continent_id, state_id, 
            start_date, end_date, description, user_id
        } = req.body

        try {

            if(typeof title == "undefined" || title == "")
                throw new Error("Field title is required")

            if(typeof start_date == "undefined" || start_date == "") 
                throw new Error("Field start_date is required")

            if(typeof end_date == "undefined" || end_date == "") 
                throw new Error("Field end_date is required")

            if(typeof continent_id == "undefined" || continent_id == "")
                throw new Error("Field continent_id is required")

            if(typeof state_id == "undefined" || state_id == "")
                throw new Error("Field state_id is required")

            if(typeof description == "undefined" || description == "")
                throw new Error("Field description is required")

            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("Field user_id is required")

            await Event.store(
                title, start_date, end_date, 
                continent_id, state_id, description, user_id
            )
            
            misc.response(res, 200, false, "", null)

        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message, null)
        }
    },

    delete: async (req, res) => { 
        const { id } = req.params 
        try {

            if(typeof id == "undefined" || id == "")
                throw new Error("Field id is required")

            await Event.delete(id)

            misc.response(res, 200, false, "", null)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message, null)
        }
    },

    update: async (req, res) => {

        const { id } = req.params

        let { title, start_date, end_date, continent_id, state_id, description } = req.body 

        try {

            if(id == ":id" || id == "") 
                throw new Error("Param id is required")

            var events = await Event.find(id) 

            if(events.length == 0)
                throw new Error("Event not found")

            if(typeof title == "undefined" || title == "")
                title = events[0].title 

            if(typeof start_date == "undefined" || start_date == "")
                start_date = events[0].start_date 

            if(typeof end_date == "undefined" || end_date == "")
                end_date == events[0].end_date

            if(typeof continent_id == "undefined" || continent_id == "")
                continent_id = events[0].continent_id

            if(typeof state_id == "undefined" || state_id == "")
                state_id = events[0].state_id

            if(typeof description == "undefined" || description == "")
                description = events[0].description

            await Event.update(id, title, start_date, end_date, continent_id, state_id, description)

            misc.response(res, 200, false, "", null)

        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message, null)
        }
    }



}