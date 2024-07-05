import { Pool } from 'pg'

export const db = new Pool({
    user: 'dev',
    host: 'localhost',
    database: 'tagged_logbook',
    port: 5432,
    // password: '',
  })