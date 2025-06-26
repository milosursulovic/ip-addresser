import mongoose from "mongoose";
import dotenv from "dotenv";
import IpEntry from "../models/IpEntry.js";

dotenv.config();

const dummyData = [
  {
    ip: "10.230.62.4",
    computerName: "OBBIZSRV",
    username: "Administrator",
    fullName: "Administrator",
    password: "Obbordata1!",
    rdp: "Ima",
  },
  {
    ip: "10.230.62.5",
    computerName: "OBZUSRV",
    username: "Administrator",
    fullName: "Administrator",
    password: "Obborprogram1!",
    rdp: "Ima",
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const existing = await IpEntry.find({});
    if (existing.length > 0) {
      console.log("IP entries already exist. Exiting...");
      return process.exit(0);
    }

    await IpEntry.insertMany(dummyData);
    console.log("Dummy IP entries seeded successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
