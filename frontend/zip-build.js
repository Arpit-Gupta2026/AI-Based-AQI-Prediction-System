import AdmZip from 'adm-zip';
import fs from 'fs';

const distDir = './dist';
const zipPath = './netlify-deploy.zip';

if (!fs.existsSync(distDir)) {
  console.error(`Error: ${distDir} does not exist. Please run 'npm run build' first.`);
  process.exit(1);
}

try {
  const zip = new AdmZip();
  // Adds all contents of dist to the root of the zip file
  zip.addLocalFolder(distDir);
  zip.writeZip(zipPath);
  console.log(`\n✅ Successfully created ${zipPath}!`);
  console.log(`\n🚀 You can now drag and drop this zip file into Netlify Drop (https://app.netlify.com/drop).`);
} catch (error) {
  console.error('Error creating zip:', error);
  process.exit(1);
}
