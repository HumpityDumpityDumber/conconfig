#! /usr/bin/env node
const fs = require('fs')
const nomnoml = require('nomnoml')

const filename = 'noml/config.noml'

function getParsedData() {
  try {
    const source = nomnoml.compileFile(filename)
    const parsedData = nomnoml.parse(source)
    return parsedData
  } catch (error) {
    console.error('Error parsing file:', error.message)
  }
}

parsedData = getParsedData()

// if (parsedData.root.nodes[0].type === 'folder') {
//   console.log(parsedData.root.nodes[0].id)
// }

console.log(parsedData.root.nodes[0].parts[1].nodes[0].parts[1].nodes[0].parts[1].nodes[0].parts[1].nodes[0].parts[1].nodes[0].parts[1].nodes[0].parts)
