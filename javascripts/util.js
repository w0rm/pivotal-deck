(function() {
  var util;

  util = {
    apiURL: function(path) {
      return "/services/v3/" + path;
    },
    loadTemplates: function(views) {
      var view, viewName;
      return $.when.apply($, (function() {
        var _results;
        _results = [];
        for (viewName in views) {
          view = views[viewName];
          if (view.prototype.templateURL) {
            _results.push((function(view) {
              return $.ajax({
                url: view.prototype.templateURL,
                type: "GET",
                dataType: "html"
              }).done(function(html) {
                return view.prototype.template = _.template(html);
              });
            })(view));
          }
        }
        return _results;
      })());
    }
  };

  this.app = window.app || {};

  this.app.util = util;

}).call(this);
