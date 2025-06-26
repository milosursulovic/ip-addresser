import express from "express";
import IpEntry from "../models/IpEntry.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      limit = 10,
      sortBy = "ip",
      sortOrder = "asc",
    } = req.query;

    const query = {
      $or: [
        { ip: { $regex: search, $options: "i" } },
        { computerName: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
        { rdp: { $regex: search, $options: "i" } },
      ],
    };

    const allowedSortFields = [
      "ip",
      "computerName",
      "username",
      "fullName",
      "rdp",
    ];
    let safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "ip";

    if (safeSortBy === "ip") {
      safeSortBy = "ipNumeric";
    }
    const sortDirection = sortOrder === "desc" ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const entries = await IpEntry.find(query)
      .sort({ [safeSortBy]: sortDirection })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await IpEntry.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({ entries, total, totalPages });
  } catch (err) {
    console.error("Error fetching IP addresses:", err);
    res.status(500).json({ message: "Greška na serveru" });
  }
});

router.post("/", async (req, res) => {
  const { ip, computerName, username, fullName, password, rdp } = req.body;

  if (!ip)
    return res.status(400).json({ message: "IP adresa je obavezno polje" });

  try {
    const newEntry = new IpEntry({
      ip,
      computerName,
      username,
      fullName,
      password,
      rdp,
    });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    console.error("Error adding IP entry:", err);
    res.status(500).json({ message: "Greška na serveru" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await IpEntry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated)
      return res.status(404).json({ message: "Unos nije pronađen" });

    res.json(updated);
  } catch (err) {
    console.error("Error updating IP entry:", err);
    res.status(500).json({ message: "Greška na serveru" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await IpEntry.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Unos nije pronađen" });

    res.json({ message: "Unos obrisan" });
  } catch (err) {
    console.error("Error deleting IP entry:", err);
    res.status(500).json({ message: "Greška na serveru" });
  }
});

export default router;
