import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { Budget, Transaction } from './models/index.js'

const app = express()

app.use(cors())
app.use(express.json())

function getUserId(request, response) {
  const { userId } = request.query

  if (!userId || !mongoose.isValidObjectId(userId)) {
    response.status(400).json({ error: 'A valid userId query parameter is required' })
    return null
  }

  return userId
}

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' })
})

app.get('/api/transactions', async (request, response, next) => {
  try {
    const userId = getUserId(request, response)
    if (!userId) return

    const limit = Math.min(Number(request.query.limit) || 20, 100)
    const filters = { user: userId }
    if (request.query.category) filters.category = request.query.category
    if (request.query.type) filters.type = request.query.type

    const transactions = await Transaction.find(filters)
      .sort({ occurredAt: -1 })
      .limit(limit)
      .lean()

    response.json({ data: transactions, count: transactions.length })
  } catch (error) {
    next(error)
  }
})

app.get('/api/budgets', async (request, response, next) => {
  try {
    const userId = getUserId(request, response)
    if (!userId) return

    const filters = { user: userId }
    if (request.query.active !== 'false') filters.isActive = true
    if (request.query.category) filters.category = request.query.category

    const budgets = await Budget.find(filters).sort({ startsOn: -1 }).lean()
    response.json({ data: budgets, count: budgets.length })
  } catch (error) {
    next(error)
  }
})

app.get('/api/summary', async (request, response, next) => {
  try {
    const userId = getUserId(request, response)
    if (!userId) return

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const grouped = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), type: 'expense', occurredAt: { $gte: startOfMonth } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ])

    const totals = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), occurredAt: { $gte: startOfMonth } } },
      { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ])
    const byType = Object.fromEntries(totals.map((item) => [item._id, item]))

    response.json({
      period: { from: startOfMonth.toISOString(), to: new Date().toISOString() },
      income: byType.income?.total || 0,
      expenses: byType.expense?.total || 0,
      transactionCount: (byType.income?.count || 0) + (byType.expense?.count || 0),
      byCategory: grouped,
    })
  } catch (error) {
    next(error)
  }
})

app.use((error, request, response, next) => {
  console.error(error)
  response.status(500).json({ error: 'Unable to fetch data' })
})

export default app
