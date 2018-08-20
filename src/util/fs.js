import fs from 'fs'

export function readFileAsync (filepath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filepath, 'utf8', function (err, content) {
      err ? reject(err) : resolve(content)
    })
  })
};

export function statFileAsync (path) {
  return new Promise(function (resolve, reject) {
    fs.stat(path, (err, stat) => err ? reject(err) : resolve(stat))
  })
};
