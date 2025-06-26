import mongoose from "mongoose";

const ipEntrySchema = new mongoose.Schema({
  ip: String,
  computerName: String,
  username: String,
  fullName: String,
  password: String,
  rdp: String,
});

const IpEntry = mongoose.model("IpEntry", ipEntrySchema);

export default IpEntry;
