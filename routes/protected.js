import express from 'express'
import IpEntry from '../models/IpEntry.js'

const router = express.Router()

router.get('/ip-addresses', async (req, res) => {
  try {
    const entries = await IpEntry.find()
    res.json(entries)
  } catch (err) {
    console.error('Error fetching IP addresses:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
