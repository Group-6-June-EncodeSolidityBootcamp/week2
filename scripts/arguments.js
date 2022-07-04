const { ethers } = require("hardhat");

function convertStringArrayToBytes32(array) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

module.exports = [
  convertStringArrayToBytes32(["Prop1", "Prop2", "Prop3", "Prop4"]),
  "0xE44d3BADa3A46E9b8A4CCb08C445E8238D770c7C",
];
