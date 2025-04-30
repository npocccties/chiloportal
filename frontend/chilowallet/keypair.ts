// @ts-ignore
const fs = require("fs");

const ION = require("@decentralized-identity/ion-tools");

const createKey = async () => {
  const key = await ION.generateKeyPair();
  console.log("key", key);
  try {
    fs.writeFileSync("./key.txt", JSON.stringify(key));
  } catch (e) {
    console.log(e);
  }
};

createKey();
