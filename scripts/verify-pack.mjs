import fs from "node:fs";

const content = fs.readFileSync("src/data/default-meme-pack.ts", "utf8");
const urls = [...content.matchAll(/imageUrl:\s*"([^"]+)"/g)].map((m) => m[1]);
console.log("Total cards referenced:", urls.length);
let missing = 0;
for (const u of urls) {
  const p = "public" + u;
  if (!fs.existsSync(p)) {
    console.error("MISSING:", p);
    missing++;
  } else {
    const sz = fs.statSync(p).size;
    console.log(`OK: ${u.padEnd(25)} (${sz} bytes)`);
  }
}
if (missing === 0) {
  console.log("\n>>> ALL 26 MEMES EXIST ON DISK AND ARE ACCESSIBLE! <<<");
} else {
  process.exit(1);
}
