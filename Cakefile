fs = require 'fs'
http = require 'http'
https = require 'https'
url = require 'url'
path = require 'path'
mime = require 'mime'
{spawn, exec} = require 'child_process'


runCommand = (name, args...) ->
  proc = spawn name, args
  proc.stderr.on 'data', (buffer) -> console.log buffer.toString()
  proc.stdout.on 'data', (buffer) -> console.log buffer.toString()
  proc.on 'exit', (status) -> process.exit(1) if status isnt 0


task 'watch', 'Watches for changed source files and builds them (scss to css, coffee to js)', (options) ->
  runCommand 'compass', 'watch', '-q', '--boring', '.'
  runCommand 'coffee', '-o', 'javascripts', '-wc', 'coffeescripts'


option '-p', '--port [PORT]', 'Sets the server port for `cake server`'
task 'server', "Serves static files and proxies api calls", (options) ->
  port = options.port ? 8080
  host = "www.pivotaltracker.com"
  apiPath = "/services/v3/"
  localPath = process.cwd()

  server = http.createServer (request, response) ->
    
    requestPath = url.parse(request.url).pathname
    
    
    if requestPath.indexOf(apiPath) is 0
      
      # Act as proxy

      console.log "Proxy request:", request.method, requestPath

      delete request.headers.host

      proxy_request = https.request
        host: host
        path: request.url
        method: request.method
        headers: request.headers

      proxy_request.on 'response',  (proxy_response) ->
        console.log "Proxy response:", proxy_response.statusCode
        if proxy_response.statusCode is 401
          # Change 401 to 403 to disable browsers basic auth dialog
          response.writeHead 403, proxy_response.headers
        else
          response.writeHead proxy_response.statusCode, proxy_response.headers
        proxy_response.pipe response

      proxy_request.on "error", (err) ->
        console.log "Problem with proxy api request:", err.message
        response.end()

      request.pipe proxy_request

    else
      
      # Serve files

      if request.method isnt "GET"      
        response.writeHead 405, "Content-Type": "text/plain"
        response.end "405 Method not allowed\n"

      request.on "end", ->
        
        fileName = path.join(localPath, requestPath)

        path.exists fileName, (exists) ->
          unless exists
            response.writeHead 404, "Content-Type": "text/plain"
            response.end "404 Not Found\n"
          else
            if fileName.indexOf(localPath) is 0
              fileName += "/index.html" if fs.statSync(fileName).isDirectory()
              fs.readFile fileName, "binary", (err, file) ->
                if err
                  response.writeHead 500, "Content-Type": "text/plain"
                  console.log "Problem with serving file:", err.message
                  response.end "500 Internal Server Error\n"
                else
                  response.writeHead 200, "Content-Type": mime.lookup(fileName)
                  response.write file, "binary"
                  response.end()
            else
              response.writeHead 403, "Content-Type": "text/plain"
              response.end "403 Forbidden\n"

  server.listen parseInt(port)

  console.log """Static file and api proxy server running at
    => http://localhost:#{port}/
    press CTRL + C to shutdown"""

