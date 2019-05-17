import express from 'express'
import { saveData } from './api/post'

const server = express()
server.use(express.json());

// :: Endpoint that parses requests
server.post('/:target', saveData)

const port = process.env.PORT || 8080
server.listen(port, () => console.info(`Server started at http://localhost:${port}`))