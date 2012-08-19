

util =

  apiURL: (path) ->
    # Constructs api url
    "/services/v3/#{path}"
  
  loadTemplates: (views) ->
    # Loads views templates and returns deffered to wait until done
    # Idea is stolen from https://github.com/ccoenraets/backbone-directory
    $.when.apply(
      $
    ,
      for viewName, view of views when view::templateURL
        ((view) ->
          $.ajax
            url:  view::templateURL
            type: "GET"
            dataType: "html"
          .done (html) ->
            view::template = _.template html
        )(view)
    )


@app = window.app || {}
@app.util = util