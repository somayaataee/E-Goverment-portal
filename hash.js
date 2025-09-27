const bcrypt = require("bcrypt");

async function makeHashes() {
  const passwords = ["admin123", "officer123", "citizen123"];

  for (let pw of passwords) {
    const hash = await bcrypt.hash(pw, 10);
    console.log(pw, "=>", hash);
  }
}

makeHashes();
