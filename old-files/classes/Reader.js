const fs = require('fs')
const path = require('path')
const mime = require('mime')
const chalk = require('chalk')
const config = require('./../config')

/**
 * This class allows the application to read through the resource
 * files of the project and places them into a JSON object with the
 * format:
 *
 *{
 *  "<floor>": {
 *    "segments": ["<img_segment_1>", "<img_segment_2>", ...],
 *    "info": "<file>"
 *  },
 * ...
 *}
 * The floor keys contain an object that has the attributes: segments, and info.
 * The segments key holds an array of all the image file locations that correspond
 * to their floor while the info key holds the file location that contains the information
 * hotspots that can be found within that floor. The typical format of the information file
 * should look like:
 *
 *  [
 *    {
 *      x: 1000,
 *      y: 500,
 *      content: "CADS means Cory Aquino Democratic Space"
 *    },
 *    ...
 * ]
 *
 * @class Reader
 */
class Reader {
  /**
   * Creates an instance of Reader.
   * @param {String} p0 - the path/directory to read through
   * @memberof Reader
   */
  constructor(p0) {
    this.data = {}

    try {
      this.load(path.normalize(p0))
    } catch (err) {
      console.log(chalk.red(err))
    }
  }

  /**
   * Loads the necessary data from a specific path.
   * Loads all the directories in the path first before
   * loading all the files in each subdirectory
   *
   * @param {String} p0 - the path/directory to read through
   * @memberof Reader
   */
  load(p0) {
    console.log(chalk.green("Checking: " + p0))

    this.loadDirectories(p0)
    this.loadFiles(p0)
  }

  /**
   * Loads all the subdirectories in the given path/directory
   * and places each subdirectory name as a key in the data
   * attribute of the class
   *
   * @param {String} p0 - the path/directory to read through
   * @memberof Reader
   */
  loadDirectories(p0) {
    fs.readdirSync(p0)
      .forEach(f0 => {
        if (fs.statSync(path.join(p0, f0)).isDirectory()) {
          this.data[f0] = {
            "segments": [],
            "info": "",
          }
        }
      })
  }

  /**
   * Loads all the files in each subdirectory of the given path/directory
   * and places each file into their respected key in the data attribute of the
   * class
   *
   * @param {String} p0 - the path/directory to read through
   * @memberof Reader
   */
  loadFiles(p0) {
    Object.keys(this.data).forEach(k => {
      let p1 = path.join(p0, k)

      fs.readdirSync(p1)
        .forEach(f => {
          if (config.img_formats.includes(mime.getType(f)))
            this.data[k].segments.push(f)
          else if (config.info_formats.includes(mime.getType(f)))
            this.data[k].info = f
        })
    })
  }
}

module.exports = Reader