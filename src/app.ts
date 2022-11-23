import express from 'express'
import bodyParser from 'body-parser'
import logsRoutes from './routes/logs'

const app = express()

app.use(bodyParser.json())

app.use('/logs', logsRoutes)

app.use((req, res, next) => {
  res.status(404).json({ message: 'Not found' })
})

app.listen(3000)
