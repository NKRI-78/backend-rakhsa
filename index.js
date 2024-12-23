const express = require("express")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const logger = require("morgan")
const compression = require("compression")
const helmet = require("helmet")
const app = express()
const config = require("./src/configs/configs")
const port = config.port
const cors = require("cors")
const routerNav = require("./src/index")
const News = require("./src/models/News")
const Sos = require("./src/models/Sos")

app.use(fileUpload())
app.use(logger("dev"))
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors({
  origin: "*",
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
}));
app.use(compression())
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use("/", routerNav)

var CronJob = require('cron').CronJob

// * * * * * * Every Seconds
// 0 */10 * * * * Every 10 minutes
// 00 00 00 * * * Midgnight

const checkEwsJob = new CronJob('0 */30 * * * *', async () => {

  var ews = await News.checkEws()

  for (const i in ews) {
    var item = ews[i]

    var id = item.id 
    var difference = item.difference

    if(difference > 24) {
      await News.deleteEws(id)
    }    
  }

})

const checkSosJob = new CronJob('0 */30 * * * *', async () => {

  var sos = await Sos.checkSosExpire()

  for (const i in sos) {
    var item = sos[i]

    var id = item.uid 
    var difference = item.difference

    if(difference > 24) {
      await Sos.expireSos(id)
    }    
  }

})

checkEwsJob.start()
checkSosJob.start()

const server = app.listen(port, () => {
  console.log(`\n\t *** Server listening on PORT ${port}  ***`)
})

app.get("*", (_, response) => {
  response.sendStatus(404)
})

module.exports = server
