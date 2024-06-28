import { Router } from 'express'
import { Pool } from 'pg'
import { Log } from '../models/log'

const pool = new Pool({
  user: 'dev',
  host: 'localhost',
  database: 'tagged_logbook',
  port: 5432,
  // password: '',
})

type ReqParams = { logId: string }
type ReqBody = { date: string; note: string }

let logs: Log[] = []

const router = Router()

router.get('/', (req, res, next) => {
  pool.query('SELECT * FROM notes ORDER BY id ASC', (error, results) => {
    if (error) throw error
    res.status(200).json({ logs: results.rows })
  })
})

router.get('/:logId', (req, res, next) => {
  const params = req.params as ReqParams
  const { logId } = params

  pool.query('SELECT * FROM notes WHERE id = $1', [logId], (error, results) => {
    if (error) throw error
    res.status(200).json({ logs: results.rows })
  })
})

router.post('/', (req, res, next) => {
  const body = req.body as ReqBody
  const { date, note } = body

  const newLog: Log = {
    id: new Date().toISOString(),
    date,
    note,
    tags: [],
  }

  logs.push(newLog)

  res.status(201).json({ message: 'Log created', log: newLog })
})

router.put('/:logId', (req, res, next) => {
  const params = req.params as ReqParams
  const { logId } = params
  const body = req.body as ReqBody
  const { date, note } = body

  const logIndex = logs.findIndex(({ id }) => id === logId)

  if (logIndex >= 0) {
    const updatedLog: Log = {
      id: logId,
      date,
      note,
      tags: [],
    }

    logs[logIndex] = updatedLog

    return res.status(200).json({ message: 'Log updated', log: updatedLog })
  }

  res.status(404).json({ message: 'Log not found' })
})

router.delete('/:logId', (req, res, next) => {
  const params = req.params as ReqParams
  const { logId } = params

  logs = logs.filter(({ id }) => id !== logId)

  res.status(200).json({ message: 'Log deleted' })
})

export default router
