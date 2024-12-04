const Administration = require("../models/Administration")
const misc = require("../helpers/response")

module.exports = {

    continents: async (req, res) => {
        try {

            var continents = await Administration.continents()

            var data = [
                {
                    id: 0,
                    name: "Pilih Benua"
                }
            ]

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

    states: async (req, res) => {
        const { continent_id } = req.body

        try {

            if(typeof continent_id == "undefined" || continent_id == "")
                throw new Error("Field continent_id is required")

            var states = await Administration.states(continent_id)

            var data = [
                {
                    id: 0,
                    name: "Pilih Negara"
                }
            ]

            for (i in states) {
                var state = states[i]

                data.push({
                    id: state.id,
                    name: state.name
                })
            }

            misc.response(res, 200, false, "", data)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    countries: async (req, res) => {
        const { search  } = req.query
        
        try {   

            if(typeof search == "undefined" || search == "") 
                throw new Error("Query search is required")

            var countries = await Administration.countries(search)

            var data = []

            for (const i in countries) {
                var country = countries[i]

                data.push({
                    id: country.id, 
                    name: country.name
                })
            }
            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    cities: async (req, res) => {
        const { continent_id, state_id } = req.body

        try {

            if(typeof continent_id == "undefined" || continent_id == "")
                throw new Error("Field continent_id is required")

            if(typeof state_id == "undefined" || state_id == "")
                throw new Error("Field state_id is required")

            var cities = await Administration.cities(
                continent_id,
                state_id
            )

            var data = []

            for (const i in cities) {
                var city = cities[i]

                data.push({
                    id: city.id,
                    name: city.name
                })
            }

            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    }

}