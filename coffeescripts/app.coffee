

class AppRouter extends Backbone.Router

  routes:
    '': 'redirect'
    'login': 'login'
    'projects': 'projects'
    'projects/:id': 'project'

  redirect: ->
    unless app.trackerToken?
      @navigate "login", trigger: true
    else
      @navigate "projects", trigger: true

  login: ->
    auth = new app.Auth
    (new app.views.LoginView model: auth).render()
    auth.on "change", =>
      if auth.has "token"
        app.trackerToken = auth.get "token"
        @navigate "projects", trigger: true

  projects: ->
    projects = new app.Projects
    (new app.views.ProjectsView collection: projects).render()
    projects.fetch()

  project: (id) ->
    project = new app.Project id: id
    (new app.views.ProjectView model: project).render()
    # Fetch stories after project model got id
    project.fetch().done -> project.fetchStories()


app.util.loadTemplates(app.views).done =>
  #$(document).foundationAlerts()
  #$(document).foundationButtons()
  #$(document).foundationAccordion()
  #$(document).foundationNavigation()
  #$(document).foundationCustomForms()
  #$(document).foundationMediaQueryViewer()
  #$(document).foundationTabs callback: $.foundation.customForms.appendCustomMarkup
  #$(document).tooltips()
  #$('input, textarea').placeholder()
  
  app.appRouter = new AppRouter # initialize only after templates are loaded
  app.appView = (new app.views.AppView).render() # store access to main app view (to render the errors and navigation)
  
  # Need to check for authorization errors.
  # This method is bad, because error events
  # better be listened on backbone models.
  $.ajaxSetup
    statusCode:
      # 401 is changed to 403 by proxy server
      # to prevent default browser's auth dialog
      403: -> app.appRouter.navigate "login", trigger: true
    # To prevent caching, uncomment the line below
    #cache: false

  Backbone.history.start()
