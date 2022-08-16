const fs = require('fs');
const path = require('path');

const CARDS_FOLDER = './public/assets/cards';
const WRITE_PATH = './src/utils/cardImgPaths.ts';
const SEPERATOR = '/';

/**
 * Constructs an array containing all card image paths without extensions, seperated by `/`
 * @example
 * [
 *   "baseSets/swordAndShield/supertypes/energy/types/base",
 *   "baseSets/swordAndShield/supertypes/energy/types/special",
 * ]
 */
const createCardImgPathArray = async () => {
  const files = await createImgPaths(CARDS_FOLDER);
  // Do some file formatting before writing
  const data = JSON.stringify(files, 'utf8')
    .replace('["', '[\n  "')
    .replaceAll('","', '",\n  "')
    .replace('"]', '",\n];\n')
    .replaceAll('"', "'");

  fs.writeFile(
    WRITE_PATH,
    `// Generated by \`./scripts/createCardImgPathArray.js\`\n\nexport default ${data}`,
    () => console.log('Card image path array created')
  );
};

/**
 * @param {string} directory
 * @param {string | undefined} totalPath
 * @returns {Promise<string[]>} An array of paths
 */
const createImgPaths = async (
  directory,
  totalPath,
) => {
  const subdirs = await fs.promises.readdir(directory, { withFileTypes: true });

  const files = await Promise.all(
    subdirs.map(async item => {
      const res = path.resolve(directory, item.name);
      const prefix = totalPath ? `${totalPath}${SEPERATOR}` : '';

      if (item.isDirectory()) {
        return createImgPaths(res, `${prefix}${item.name}`);
      }

      // Remove extension
      return `${prefix}${item.name.slice(0, -4)}`;
    }),
  );

  return files.flat();
};

(async () => {
  await createCardImgPathArray();
})();
