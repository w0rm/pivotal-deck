(function() {
  var getValue, methodMap, urlError;

  Backbone.sync = function(method, model, options) {
    var params, type;
    type = methodMap[method];
    options || (options = {});
    params = {
      type: type,
      dataType: 'xml',
      headers: {
        "X-TrackerToken": app.trackerToken
      }
    };
    if (!options.url) params.url = getValue(model, "url") || urlError();
    if (!options.data && model && (method === "create" || method === "update")) {
      params.contentType = "application/xml";
      params.data = json2xml(model.toJSON());
    }
    if (params.type !== 'GET') params.processData = false;
    return $.ajax(_.extend(params, options));
  };

  methodMap = {
    create: 'POST',
    update: 'PUT',
    "delete": 'DELETE',
    read: 'GET'
  };

  getValue = function(object, prop) {
    if (!(object && object[prop])) return null;
    if (_.isFunction(object[prop])) {
      return object[prop]();
    } else {
      return object[prop];
    }
  };

  urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

}).call(this);
