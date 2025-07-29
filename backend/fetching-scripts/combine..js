const fs = require('fs');
const path = require('path');

const categories = [
  'dairy',
  'fruit',
  'vegetables',
  'protein',
  'fat',
  'grains'
];

const combined = {};

categories.forEach(category => {
  const filePath = path.join(__dirname, `${category}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    combined[category] = Array.isArray(data) ? data : data[category];
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});

const outputPath = path.join(
  __dirname,
  '../../apps/web/public/all-items.json'
);
fs.writeFileSync(outputPath, JSON.stringify(combined, null, 2));
console.log('Combined file written to apps/web/public/all-items.json');