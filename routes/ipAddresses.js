import express from "express";
import IpEntry from "../models/IpEntry.js";
import { Parser } from "json2csv";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import XLSX from "xlsx";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

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

router.get("/export", async (req, res) => {
  try {
    const { search = "" } = req.query;

    const query = {
      $or: [
        { ip: { $regex: search, $options: "i" } },
        { computerName: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
        { rdp: { $regex: search, $options: "i" } },
      ],
    };

    const entries = await IpEntry.find(query).sort({ ipNumeric: 1 });

    const fields = [
      "ip",
      "ipNumeric",
      "computerName",
      "username",
      "fullName",
      "password",
      "rdp",
    ];

    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(entries);

    res.setHeader("Content-Disposition", "attachment; filename=ip-entries.csv");
    res.setHeader("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (err) {
    console.error("CSV Export error:", err);
    res.status(500).json({ message: "Greška pri izvozu CSV-a" });
  }
});

router.get("/export-xlsx", async (req, res) => {
  try {
    const { search = "" } = req.query;

    const query = {
      $or: [
        { ip: { $regex: search, $options: "i" } },
        { computerName: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
        { rdp: { $regex: search, $options: "i" } },
      ],
    };

    const entries = await IpEntry.find(query).sort({ ipNumeric: 1 });

    const data = entries.map((entry) => ({
      ip: entry.ip,
      ipNumeric: entry.ipNumeric,
      computerName: entry.computerName,
      username: entry.username,
      fullName: entry.fullName,
      password: entry.password,
      rdp: entry.rdp,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "IP Adrese");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=ip-entries.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.status(200).send(buffer);
  } catch (err) {
    console.error("Greška pri izvozu XLSX:", err);
    res.status(500).json({ message: "Greška pri izvozu XLSX-a" });
  }
});

router.post("/import", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  const ext = req.file.originalname.split(".").pop().toLowerCase();

  try {
    let results = [];

    if (ext === "csv") {
      const csvRows = fs.readFileSync(filePath, "utf8").split("\n");
      const headers = csvRows[0]
        .split(",")
        .map((h) => h.trim().replace(/^"|"$/g, ""));
      for (let i = 1; i < csvRows.length; i++) {
        const row = csvRows[i].split(",");
        if (row.length !== headers.length) continue;
        const obj = {};
        headers.forEach((key, index) => {
          const cleanKey = key.replace(/^"|"$/g, "");
          const value = row[index]?.trim().replace(/^"|"$/g, "");
          obj[cleanKey] = value;
        });
        results.push(obj);
      }
    } else if (ext === "xlsx") {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      results = XLSX.utils.sheet_to_json(sheet);
    } else {
      return res.status(400).json({
        message: "Nepodržan format. Samo .csv i .xlsx su dozvoljeni.",
      });
    }

    const entriesToInsert = results
      .map((row) => ({
        ip: row.ip?.trim(),
        ipNumeric: row.ipNumeric,
        computerName: row.computerName?.trim() || "",
        username: row.username?.trim() || "",
        fullName: row.fullName?.trim() || "",
        password: row.password?.trim() || "",
        rdp: row.rdp?.trim() || "",
      }))
      .filter((e) => e.ip);

    const inserted = await IpEntry.insertMany(entriesToInsert, {
      ordered: false,
    });

    fs.unlinkSync(filePath);
    res.status(200).json({ message: "Import uspešan", count: inserted.length });
  } catch (err) {
    console.log("ovde");
    console.error("Import error:", err);
    fs.unlinkSync(filePath);
    res.status(500).json({ message: "Greška pri importu" });
  }
});

router.get("/available", async (req, res) => {
  try {
    const occupiedEntries = await IpEntry.find({}, "ipNumeric");

    const occupiedSet = new Set(occupiedEntries.map((e) => e.ipNumeric));

    const ipToNumeric = (ip) =>
      ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);

    const numericToIp = (num) =>
      [24, 16, 8, 0].map((shift) => (num >> shift) & 255).join(".");

    const start = ipToNumeric("10.230.62.1");
    const end = ipToNumeric("10.230.63.254");

    const availableIps = [];
    for (let i = start; i <= end; i++) {
      if (!occupiedSet.has(i)) {
        availableIps.push(numericToIp(i));
      }
    }

    res.json({ available: availableIps });
  } catch (err) {
    console.error("Greška pri dohvatanju slobodnih IP adresa:", err);
    res.status(500).json({ message: "Greška na serveru" });
  }
});

export default router;
