const fs = require('fs')

const path = './test/moment'
const outputDir = './build'

const fileList = fs.readdirSync(path, function(err, files){
  if (err) throw err;

  return files.filter(function(file){
      return fs.statSync(file).isFile() && /.*\.js$/.test(file); //絞り込み
  })
});

const configs = fileList.map((file) => {
  return {
    input: path + '/' + file,
    output: {
      file: outputDir + '/' + file,
     format: 'cjs'
    }
  }
})

const newConfigs = [...configs, ...[
  // {
  //   input: './test/qunit.js',
  //   output: {
  //     file: outputDir + '/qunit.js',
  //     format: 'cjs'
  //   }
  // },
  // {
  //   input: './test/qunit-locale.js',
  //   output: {
  //     file: outputDir + '/qunit-locale.js',
  //     format: 'cjs'
  //   }
  // },
  // {
  //   input: './test/helpers/common-locale.js',
  //   output: {
  //     file: outputDir + '/common-locale.js',
  //     format: 'cjs'
  //   }
  // }
]]

export default newConfigs
