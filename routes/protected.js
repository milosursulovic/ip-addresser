import express from 'express'
import IpEntry from '../models/IpEntry.js'

const router = express.Router()

router.get('/ip-addresses', async (req, res) => {
  try {
    const entries = await IpEntry.find()
    res.json(entries)
  } catch (err) {
    console.error('Error fetching IP addresses:', err)
    res.status(500).json({ message: 'Greška na serveru' })
  }
})

router.post('/ip-addresses', async (req, res) => {
  const { ip, computerName, username, fullName, password, rdp } = req.body

  if (!ip) return res.status(400).json({ message: 'IP adresa je obavezno polje' })

  try {
    const newEntry = new IpEntry({ ip, computerName, username, fullName, password, rdp })
    await newEntry.save()
    res.status(201).json(newEntry)
  } catch (err) {
    console.error('Error adding IP entry:', err)
    res.status(500).json({ message: 'Greška na serveru' })
  }
})

export default router
