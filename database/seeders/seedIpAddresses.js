import mongoose from "mongoose";
import dotenv from "dotenv";
import IpEntry from "../../models/IpEntry.js";

dotenv.config();

const dummyData = [
  {
    ip: "10.230.62.4",
    ipNumeric: 182536756,
    computerName: "OBBIZSRV",
    username: "Administrator",
    fullName: "Administrator",
    password: "Obbordata1!",
    rdp: "Ima",
  },
  {
    ip: "10.230.62.5",
    ipNumeric: 182536757,
    computerName: "OBZUSRV",
    username: "Administrator",
    fullName: "Administrator",
    password: "Obborprogram1!",
    rdp: "Ima",
  },
  {
    ip: "10.230.62.6",
    ipNumeric: 182536758,
    computerName: "CLIENT01",
    username: "user1",
    fullName: "User One",
    password: "Password123!",
    rdp: "Nema",
  },
  {
    ip: "10.230.62.7",
    ipNumeric: 182536759,
    computerName: "CLIENT02",
    username: "user2",
    fullName: "User Two",
    password: "Password123!",
    rdp: "Ima",
  },
  {
    ip: "10.230.62.8",
    ipNumeric: 182536760,
    computerName: "CLIENT03",
    username: "user3",
    fullName: "User Three",
    password: "Password123!",
    rdp: "Nema",
  },
  {
    ip: "10.230.62.9",
    ipNumeric: 182536761,
    computerName: "CLIENT04",
    username: "user4",
    fullName: "User Four",
    password: "Password123!",
    rdp: "Ima",
  },
  {
    ip: "10.230.62.10",
    ipNumeric: 182536762,
    computerName: "CLIENT05",
    username: "user5",
    fullName: "User Five",
    password: "Password123!",
    rdp: "Nema",
  },
  {
    ip: "10.230.62.11",
    ipNumeric: 182536763,
    computerName: "CLIENT06",
    username: "user6",
    fullName: "User Six",
    password: "Password123!",
    rdp: "Ima",
  },
  {
    ip: "10.230.62.12",
    ipNumeric: 182536764,
    computerName: "CLIENT07",
    username: "user7",
    fullName: "User Seven",
    password: "Password123!",
    rdp: "Nema",
  },
  {
    ip: "10.230.62.13",
    ipNumeric: 182536765,
    computerName: "CLIENT08",
    username: "user8",
    fullName: "User Eight",
    password: "Password123!",
    rdp: "Ima",
  },
  {
    ip: "10.230.62.14",
    ipNumeric: 182536766,
    computerName: "CLIENT09",
    username: "user9",
    fullName: "User Nine",
    password: "Password123!",
    rdp: "Nema",
  },
  {
    ip: "10.230.62.15",
    ipNumeric: 182536767,
    computerName: "CLIENT10",
    username: "user10",
    fullName: "User Ten",
    password: "Password123!",
    rdp: "Ima",
  },
  {
    ip: "10.230.62.16",
    ipNumeric: 182536768,
    computerName: "CLIENT11",
    username: "user11",
    fullName: "User Eleven",
    password: "Password123!",
    rdp: "Nema",
  },
  {
    ip: "10.230.62.17",
    ipNumeric: 182536769,
    computerName: "CLIENT12",
    username: "user12",
    fullName: "User Twelve",
    password: "Password123!",
    rdp: "Ima",
  },
  {
    ip: "10.230.62.18",
    ipNumeric: 182536770,
    computerName: "CLIENT13",
    username: "user13",
    fullName: "User Thirteen",
    password: "Password123!",
    rdp: "Nema",
  },
  {
    ip: "10.230.62.19",
    ipNumeric: 182536771,
    computerName: "CLIENT14",
    username: "user14",
    fullName: "User Fourteen",
    password: "Password123!",
    rdp: "Ima",
  },
  {
    ip: "10.230.62.20",
    ipNumeric: 182536772,
    computerName: "CLIENT15",
    username: "user15",
    fullName: "User Fifteen",
    password: "Password123!",
    rdp: "Nema",
  },
  {
    ip: "10.230.62.21",
    ipNumeric: 182536773,
    computerName: "CLIENT16",
    username: "user16",
    fullName: "User Sixteen",
    password: "Password123!",
    rdp: "Ima",
  },
  {
    ip: "10.230.62.22",
    ipNumeric: 182536774,
    computerName: "CLIENT17",
    username: "user17",
    fullName: "User Seventeen",
    password: "Password123!",
    rdp: "Nema",
  },
  {
    ip: "10.230.62.23",
    ipNumeric: 182536775,
    computerName: "CLIENT18",
    username: "user18",
    fullName: "User Eighteen",
    password: "Password123!",
    rdp: "Ima",
  },
  {
    ip: "10.230.62.24",
    ipNumeric: 182536776,
    computerName: "CLIENT19",
    username: "user19",
    fullName: "User Nineteen",
    password: "Password123!",
    rdp: "Nema",
  },
  {
    ip: "10.230.62.25",
    ipNumeric: 182536777,
    computerName: "CLIENT20",
    username: "user20",
    fullName: "User Twenty",
    password: "Password123!",
    rdp: "Ima",
  },
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
