const Administration = require("../models/Administration")
const misc = require("../helpers/response")

module.exports = {

    continents: async (_, res) => {
        try {

            var continents = await Administration.continents()

            var data = []

            for (i in continents) {
                var continent = continents[i]

                data.push({
                    id: continent.id,
                    name: continent.name
                })
            }

            misc.response(res, 200, false, "", data)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, "Server error")
        }
    },

    states: async (_, res) => {
        try {

            var states = await Administration.states()

            var data = []

            for (i in states) {
                var state = states[i]

                data.push({
                    id: state.id,
                    continent_id: state.continent_id,
                    name: state.name
                })
            }

            misc.response(res, 200, false, "", data)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, "Server error")
        }
    },

}