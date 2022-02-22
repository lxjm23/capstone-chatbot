const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

require('./routes/dialogFlowRoutes')(app)

const PORT = process.env.PORT || 5000


app.listen(PORT, () => {
    console.log('Listening to PORT 5000.')
})