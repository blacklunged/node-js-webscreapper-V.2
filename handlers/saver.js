import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

export default async function saveData(data) {
  const { code } = data;
  const fileName = `${code}.json`;
  const savePath = path.join(path.resolve('data'), fileName );

  return new Promise((resolve, reject) => {
    fs.writeFile(savePath, JSON.stringify(data, null, 4), err => {

      if (err) {
        return reject(err);
      }
      console.log(chalk.blue('File was saved successfully: ') + chalk.blue.bold(fileName) + '\n');

      resolve();
    });
  });

}