import { Router } from 'express'
import { db } from '../postgres-config';

type ReqParams = { logId: string }
type ReqBody = { date: string; note: string }

const router = Router()

router.get('/', (req, res, next) => {
  db.query('SELECT * FROM notes ORDER BY id ASC', (error, results) => {
    if (error) throw error
    return res.status(200).json({ logs: results.rows })
  })
})

router.get('/:logId', (req, res, next) => {
  const params = req.params as ReqParams
  const { logId } = params

  db.query('SELECT * FROM notes WHERE id = $1', [logId], (error, results) => {
    if (error) throw error
    return res.status(200).json({ logs: results.rows })
  })
})

router.post('/', (req, res, next) => {
  const body = req.body as ReqBody
  const { date, note } = body

  db.query('INSERT INTO notes (text, date) VALUES ($1, $2) RETURNING *', [note, date], (error, results) => {
    if (error) throw error
    return res.status(201).json({ message: 'Log created', log: results.rows[0] })
  })
})

router.put('/:logId', (req, res, next) => {
  const params = req.params as ReqParams
  const { logId } = params
  const body = req.body as ReqBody
  const { date, note } = body

  db.query(
    'UPDATE notes SET text = $1, date = $2 WHERE id = $3 RETURNING *',
    [note, date, logId],
    (error, results) => {
      if (error) throw error
      if (!results.rowCount){
        return res.status(404).json({ message: 'Log not found', logId })
      }

      return res.status(200).json({ message: 'Log updated', log: results.rows[0] })
    }
  )
})

router.delete('/:logId', (req, res, next) => {
  const params = req.params as ReqParams
  const { logId } = params

  db.query('DELETE FROM notes WHERE id = $1 RETURNING *', [logId], (error, results) => {
    if (error) throw error
    if (!results.rowCount){
      return res.status(404).json({ message: 'Log not found', logId })
    }

    return res.status(200).json({ message: 'Log deleted', log: results.rows[0] })
  })
})

export default router
