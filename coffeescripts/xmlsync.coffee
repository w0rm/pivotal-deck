

# Override Backbone.sync to be able to use it with xml REST service
Backbone.sync = (method, model, options) ->
  # Convert method to type
  type = methodMap[method]

  # Default options, unless specified.
  options or (options = {})

  # Default XML-request options.
  params =
    type: type
    dataType: 'xml'
    headers:
      "X-TrackerToken": app.trackerToken # this is specific to Pivotal Tracker api

  # Ensure that we have a URL.
  params.url = getValue(model, "url") or urlError() unless options.url

  # Ensure that we have the appropriate request data.
  if not options.data and model and (method is "create" or method is "update")
    params.contentType = "application/xml"
    params.data = json2xml model.toJSON() # convert model to xml
  
  if params.type isnt 'GET'
      params.processData = false
  
  # Make the request, allowing the user to override any Ajax options.
  $.ajax _.extend(params, options)


methodMap =
  create: 'POST'
  update: 'PUT'
  delete: 'DELETE'
  read:   'GET'


getValue = (object, prop) ->
  return null  unless object and object[prop]
  (if _.isFunction(object[prop]) then object[prop]() else object[prop])


urlError = -> throw new Error('A "url" property or function must be specified')
