#! /usr/bin/env node
const http = require('http')
const fs = require('fs')
const nomnoml = require('nomnoml')

const PORT = 3000
const filename = 'config.noml'
const filepath = 'noml/' + filename

// Track last modification time for auto-refresh
let lastModified = fs.statSync(filepath).mtime.getTime()

// Create HTTP server
const server = http.createServer((req, res) => {
  try {
    if (req.url === '/' || req.url === '/index.html') {
      // Serve the main HTML page
      const source = nomnoml.compileFile(filepath)
      const svg = nomnoml.renderSvg(source)
      
      // Read the HTML template and replace placeholders
      const template = fs.readFileSync('template.html', 'utf8')
      const html = template
        .replace('{{FILENAME}}', filename)
        .replace('{{SVG_CONTENT}}', svg)
      
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(html)
      
    } else if (req.url === '/shutdown' && req.method === 'POST') {
      // Handle server shutdown
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('Server shutting down...')
      
      console.log('\nShutdown requested from web interface...')
      setTimeout(() => {
        console.log('Server stopped.')
        process.exit(0)
      }, 100)
      
    } else if (req.url === '/svg') {
      // Serve just the SVG
      const source = nomnoml.compileFile(filepath)
      const svg = nomnoml.renderSvg(source)
      
      res.writeHead(200, { 'Content-Type': 'image/svg+xml' })
      res.end(svg)
      
    } else if (req.url === '/check-update') {
      // Check if file has been modified
      const currentModified = fs.statSync(filepath).mtime.getTime()
      const isUpdated = currentModified > lastModified
      
      if (isUpdated) {
        lastModified = currentModified
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ updated: isUpdated }))
      
    } else {
      // 404 for other routes
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not Found')
    }
  } catch (error) {
    console.error('Error:', error)
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end('Internal Server Error: ' + error.message)
  }
})

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  console.log(`Serving diagram: ${filename}`)
  console.log('Press Ctrl+C to stop the server')
})
