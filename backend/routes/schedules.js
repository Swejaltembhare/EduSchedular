const express = require('express')
const router = express.Router()
const Schedule = require('../models/Schedule')

// Create schedule
router.post('/', async (req, res) => {
  try {
    const s = await Schedule.create(req.body)
    res.status(201).json(s)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Get all
router.get('/', async (req, res) => {
  const list = await Schedule.find().limit(50)
  res.json(list)
})

// Get by id
router.get('/:id', async (req, res) => {
  const s = await Schedule.findById(req.params.id)
  if(!s) return res.status(404).json({ error: 'Not found' })
  res.json(s)
})

// Update
router.put('/:id', async (req, res) => {
  const s = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(s)
})

// Delete
router.delete('/:id', async (req, res) => {
  await Schedule.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

module.exports = router