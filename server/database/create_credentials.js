"use strict";

const crypto = require("crypto");

// Password to hash
const password = "1234";

const users = ["alice", "bob", "charlie", "david", "eve"];

for (const user of users) {
  // Generate 8 random bytes for salt (64 bits)
  const salt = crypto.randomBytes(8);
  const saltHex = salt.toString("hex");

  // Use scrypt with salt as Buffer, 32 bytes key length
  const hash = crypto.scryptSync(password, salt, 32);

  const hashHex = hash.toString("hex");

  console.log(
    `('${user}', '${user}@example.com', '${hashHex}', '${saltHex}', 'LXBSMDTMSP2I5XFXIYRGFVWSFI', 0),`
  );
}

function generateSessionSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

console.log(generateSessionSecret());
