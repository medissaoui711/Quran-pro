const fs = require('fs');
let content = fs.readFileSync('src/data/quranMetadata.ts', 'utf-8');

// Find the SURAHS array string
const surahsMatch = content.match(/export const SURAHS: Surah\[\] = \[([\s\S]*?)\];/);

if (surahsMatch) {
  let modified = surahsMatch[1].replace(/({[^}]+})/g, (match) => {
    // Extract the number
    const numMatch = match.match(/number:\s*(\d+)/);
    if (numMatch) {
      const num = parseInt(numMatch[1], 10);
      const bismillahPrecedes = (num !== 1 && num !== 9);
      return match.replace('}', `, bismillahPrecedes: ${bismillahPrecedes} }`);
    }
    return match;
  });
  content = content.replace(surahsMatch[0], `export const SURAHS: Surah[] = [${modified}];`);
  fs.writeFileSync('src/data/quranMetadata.ts', content, 'utf-8');
  console.log("Metadata updated successfully.");
} else {
  console.log("Could not find SURAHS array.");
}
