const mongoose = require("mongoose");
require("dotenv").config();

const Device = require("./src/models/Device");

const unitIds = [
  "6a28cf57454cb1ce1a6a9490",
  "6a28cf63454cb1ce1a6a9491",
  "6a28cf85454cb1ce1a6a9492",
  "6a28cf97454cb1ce1a6a9493",
];

const deviceTypes = [
  "DESKTOP",
  "LAPTOP",
  "PRINTER",
  "SERVER",
];

const purposes = [
  "QLVB",
  "DLDC",
  "ĐKX",
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const devices = [
{
deviceCode: "PC-001",
name: "Dell OptiPlex 7010",
type: "DESKTOP",
purpose: "QLVB",
unitId: unitIds[0],
specifications: {
cpu: "Intel Core i5-12400",
ram: "8GB",
serialNumber: "DL7010001"
},
status: "ACTIVE"
},
{
deviceCode: "PC-002",
name: "Dell OptiPlex 7010",
type: "DESKTOP",
purpose: "QLVB",
unitId: unitIds[0],
specifications: {
cpu: "Intel Core i5-12400",
ram: "8GB",
serialNumber: "DL7010002"
},
status: "ACTIVE"
},
{
deviceCode: "PC-003",
name: "HP ProDesk 400 G9",
type: "DESKTOP",
purpose: "DLDC",
unitId: unitIds[1],
specifications: {
cpu: "Intel Core i5-12500",
ram: "16GB",
serialNumber: "HP400001"
},
status: "ACTIVE"
},
{
deviceCode: "PC-004",
name: "Lenovo ThinkCentre M70s",
type: "DESKTOP",
purpose: "ĐKX",
unitId: unitIds[2],
specifications: {
cpu: "Intel Core i7-12700",
ram: "16GB",
serialNumber: "LN700001"
},
status: "ACTIVE"
},
{
deviceCode: "PC-005",
name: "FPT Elead E711",
type: "DESKTOP",
purpose: "QLVB",
unitId: unitIds[3],
specifications: {
cpu: "Intel Core i3-10100",
ram: "8GB",
serialNumber: "FPT711001"
},
status: "MAINTENANCE"
},
{
deviceCode: "LT-001",
name: "Dell Latitude 5440",
type: "LAPTOP",
purpose: "QLVB",
unitId: unitIds[0],
specifications: {
cpu: "Intel Core i5-1335U",
ram: "16GB",
serialNumber: "DL5440001"
},
status: "ACTIVE"
},
{
deviceCode: "LT-002",
name: "HP ProBook 440 G10",
type: "LAPTOP",
purpose: "DLDC",
unitId: unitIds[1],
specifications: {
cpu: "Intel Core i5-1334U",
ram: "16GB",
serialNumber: "HP440001"
},
status: "ACTIVE"
},
{
deviceCode: "LT-003",
name: "Lenovo ThinkPad E14",
type: "LAPTOP",
purpose: "ĐKX",
unitId: unitIds[2],
specifications: {
cpu: "Intel Core i7-1355U",
ram: "16GB",
serialNumber: "TP140001"
},
status: "ACTIVE"
},
{
deviceCode: "PR-001",
name: "Canon LBP2900",
type: "PRINTER",
purpose: "QLVB",
unitId: unitIds[0],
specifications: {
serialNumber: "CAN2900001"
},
status: "ACTIVE"
},
{
deviceCode: "PR-002",
name: "Canon MF241D",
type: "PRINTER",
purpose: "QLVB",
unitId: unitIds[1],
specifications: {
serialNumber: "CAN2410001"
},
status: "ACTIVE"
},
{
deviceCode: "PR-003",
name: "Brother HL-L2366DW",
type: "PRINTER",
purpose: "DLDC",
unitId: unitIds[2],
specifications: {
serialNumber: "BRO2366001"
},
status: "ACTIVE"
},
{
deviceCode: "PR-004",
name: "HP LaserJet Pro M404dn",
type: "PRINTER",
purpose: "ĐKX",
unitId: unitIds[3],
specifications: {
serialNumber: "HP4040001"
},
status: "BROKEN"
},
{
deviceCode: "SV-001",
name: "Dell PowerEdge R550",
type: "SERVER",
purpose: "QLVB",
unitId: unitIds[0],
specifications: {
cpu: "Xeon Silver 4310",
ram: "64GB",
serialNumber: "R5500001"
},
status: "ACTIVE"
},
{
deviceCode: "SV-002",
name: "HPE ProLiant DL380 Gen10",
type: "SERVER",
purpose: "DLDC",
unitId: unitIds[1],
specifications: {
cpu: "Xeon Silver 4210",
ram: "128GB",
serialNumber: "DL380001"
},
status: "ACTIVE"
}
];
while (devices.length < 50) {
  const base = devices[devices.length % 14];

  devices.push({
    ...base,
    deviceCode: `${base.deviceCode}-${devices.length}`,
    specifications: {
      ...base.specifications,
      serialNumber: `SN${100000 + devices.length}`
    }
  });
}
    await Device.insertMany(devices);

   

    console.log(`Inserted ${devices.length} devices`);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();
