import { Router } from 'express'
import { Log } from '../models/log'

type ReqParams = { logId: string }
type ReqBody = { date: string; note: string }

let logs: Log[] = []

const router = Router()

router.get('/', (req, res, next) => {
  res.status(200).json({ logs })
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
