import express from 'express'
import bodyParser from 'body-parser'
import logsRoutes from './routes/logs'

const app = express()
const PORT = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/logs', logsRoutes)

app.use((req, res, next) => {
  res.status(404).json({ message: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})
