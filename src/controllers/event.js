const escapeQoute = require('escape-quotes')
const misc = require('../helpers/response')
const Event = require('../models/Event')
const utils = require('../helpers/utils')
const Fcm = require('../models/Fcm')
const moment = require('moment')

const { v4: uuidv4 } = require('uuid')

module.exports = {

    all: async (req, res) => {

        const { user_id } = req.body

        try {

            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("user_id wajib diisi")

            var events = await Event.all()

            var data = []

            for(i in events)  {
                var event = events[i]

                var checkEventSelfJoin = await Event.checkEventSelfJoin(user_id, event.uid)
                var checkEventJoin = await Event.checkEventJoin(event.uid)

                var isPassed = utils.hasDatePassed(event.date)

                data.push({
                    id: event.uid,
                    picture: event.picture == null ? "" : event.picture,
                    title: event.title, 
                    description: event.description,
                    date: utils.formatDate(event.date),
                    paid: event.is_paid == 1 ? true : false,
                    is_passed: isPassed,
                    location: event.location == null ? "" : event.location,
                    start: event.start == null ? "" : event.start,
                    end: event.end == null ? "" : event.end,
                    users: checkEventJoin,
                    joined: checkEventSelfJoin.length > 0 ? true : false
                })
            }

            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, false, "Server error")
        }
    },

    getEventSaka: async (req, res) => {
        const { user_id } = req.body;

        try {

            if(typeof user_id == "undefined" || user_id =="")
                throw new Error("Field user_id is required");

            var events = await Event.getEventSaka();
 
            var data = [];

            for (const i in events) {
                var event = events[i]

                var eventJoins = await Event.getEventJoinSaka(event.event_id)

                const userJoined = eventJoins.some(join => join.user_id === user_id)

                const paths = await Event.getMediaSaka(event.picture)

                var startDate = moment(event.start_date)
                var endDate = moment(event.end_date)

                console.log(event.end_date)

                data.push({
                    event_id: event.event_id, 
                    description: event.description,
                    start_date: startDate,
                    end_date: event.end_date == null || event.end_date == "" 
                    ? startDate 
                    : endDate,
                    status: event.status,
                    location: event.location,
                    start: event.start,
                    end: event.end,
                    summary: event.summary,
                    path: paths.length == 0 
                    ? '-' 
                    : paths[0].path,
                    share_news: event.share_news,
                    created_by: event.created_by,
                    created: event.created,
                    updated: event.updated,
                    joins: eventJoins,
                    join: userJoined,
                })
            }   

            misc.response(res, 200, false, "", data);
        } catch(e) {    
            console.log(e)
            misc.response(res, 400, false, e.message);
        }
    },

    getEventJoinSaka: async (req, res) => {

        const { event_id } = req.body
 
        try {

            if(typeof event_id == "undefined" || event_id == "")
                throw new Error("Field event_id is required");

            var events = await Event.getEventJoinSaka(event_id);

            console.log(events);

            misc.response(res, 200,false, "", events);

        } catch(e) {
            console.log(e)
            misc.response(res, 400, false, e.message)
        }
    },

    createOrUpdate: async (req, res) => {
        const { id, picture, title, desc, date, start, end, location, paid } = req.body

        try {

            if(typeof id == "undefined" || id == "")
                throw new Error("id wajib diisi")

            if(typeof picture == "undefined" || picture == "")
                throw new Error("picture wajib diisi")

            if(typeof title == "undefined" || title == "")
                throw new Error("title wajib diisi")

            if(typeof desc == "undefined" || desc == "")
                throw new Error("desc wajib diisi")

            if(typeof date == "undefined" || date == "")
                throw new Error("date wajib diisi")

            if(typeof start == "undefined" || start == "")
                throw new Error("start wajib diisi")
            
            if(typeof end == "undefined" || end == "")
                throw new Error("end wajib diisi")

            if(typeof location == "undefined" || location == "")
                throw new Error("location wajib diisi")

            if(typeof paid == "undefined")
                throw new Error("paid wajib diisi")

            await Event.createOrUpdate(
                id, picture, escapeQoute(title), escapeQoute(desc), 
                date, start, end, location, paid == true ? 1 : 0     
            )

            var users = await Fcm.users()

            for (const i in users) {
                var user = users[i]

                await utils.sendFCM(title, utils.getExcerpt(utils.escapeHtml(desc), 20), user.token, 'event', '-', id)
            }

            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    join: async (req, res) => {
        const { user_id, event_id } = req.body 

        try {

            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("user_id wajib diisi")

            if(typeof event_id == "undefined" || event_id == "")
                throw new Error("event_id wajib diisi")

            await Event.joinEvent(uuidv4(), user_id, event_id)

            misc.response(res, 200, false, "")

        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    detail: async (req, res) => {
        const { id, user_id } = req.body 

        try {

            if(typeof id == "undefined" || id == "")
                throw new Error("id wajib diisi")

            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("user_id wajib diisi")

            var detail = await Event.detail(id)
            if(detail.length == 0)
                throw new Error("Event tidak ditemukan")

            var checkEventSelfJoin = await Event.checkEventSelfJoin(user_id, detail[0].uid)

            var data = {
                id: detail[0].uid,
                picture: detail[0].picture == null ? "" : detail[0].picture,
                title: detail[0].title, 
                description: detail[0].description,
                date: utils.formatDate(detail[0].date),
                paid: detail[0].is_paid == 1 ? true : false,
                location: detail[0].location == null ? "" : detail[0].location,
                start: detail[0].start == null ? "" : detail[0].start,
                end: detail[0].end == null ? "" : detail[0].end,
                joined: checkEventSelfJoin.length > 0 ? true : false
            }
             
            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message) 
        }
    },

    delete: async (req, res) => {
        const { id } = req.body

        try {
            
            if(typeof id == "undefined" || id == "")
                throw new Error("id wajib diisi")

            var checkEvents = await Event.checkEvents(id)
            
            if(checkEvents.length == 0)
                throw new Error("Event tidak ditemukan")

            await Event.delete(id)

            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    }
}