import 'dotenv/config'
import mongoose from 'mongoose'
import app from './app.js'

const port = process.env.PORT || 4000
const mongoUri = process.env.MONGODB_URI

async function startServer() {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required to start the API server')
  }

  await mongoose.connect(mongoUri)
  app.listen(port, () => {
    console.log(`SpendWise API listening on http://localhost:${port}`)
  })
}

startServer().catch((error) => {
  console.error('Unable to start SpendWise API:', error.message)
  process.exitCode = 1
})
