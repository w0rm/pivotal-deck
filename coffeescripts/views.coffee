

class AppView extends Backbone.View

  el: 'body'
  templateURL: "templates/app.html"
  
  render: ->
    # appView should be rendered only once
    @$el.html @template()
    _.invoke [new AppHeaderView, new AppFooterView], "render"
    @
  
  renderError: (error) ->
    @$(".alerts").append (new ErrorView error).render().el
  
  clearErrors: ->
    @$(".alerts .close").trigger "click"


class ErrorView extends Backbone.View
  
  tagName: "div"
  className: "alert-box alert"
  templateURL: "templates/error.html"
  
  initialize: (error) ->
    @error = error
  
  render: ->
    @$el.html @template(@error)
    @  

class AppHeaderView extends Backbone.View
  
  el: 'header'
  templateURL: "templates/app-header.html"

  render: ->
    @$el.html @template()
    @


class AppFooterView extends Backbone.View

  el: 'footer'
  templateURL: "templates/app-footer.html"

  render: ->
    @$el.html @template()
    @


class LoginView extends Backbone.View

  el: '#page'
  templateURL: "templates/login.html"

  events:
    "submit form": "login"

  initialize: (options) ->
    @model.on "error", (model, error) =>
      @$("[type=submit]").removeAttr "disabled"
      @$("form").addClass "error"
      if _.isString error
        app.appView.renderError message: error

  render: ->
    @$el.html @template()
    @

  login: (e) ->
    e.preventDefault()
    @$("[type=submit]").attr "disabled", "disabled"
    app.appView.clearErrors()
    @model.save
      username: @$("[name=username]").val()
      password: @$("[name=password]").val()
    @


class ProjectsView extends Backbone.View

  el: '#page'
  templateURL: "templates/projects.html"
  
  initialize: (options) ->
    @collection.on "reset", @render, @
    @$el.html @template()
    @$projects = @$(".projects")

  render: ->
    @$projects.empty()
    for project in @collection.models
      @$projects.append (new ProjectItemView model: project).render().el
    @


class ProjectItemView extends Backbone.View

  tagName: "article"
  className: "project"
  templateURL: "templates/project-item.html"

  render: ->
    @$el.html @template @model.attributes # project.toJSON is overridden
    @


class ProjectView extends Backbone.View

  el: '#page'
  templateURL: "templates/project.html"

  initialize: (options) ->
    @model.on "change", @renderTitle, @
    @model.icebox.on "reset", @renderIcebox, @ # should happen after change
    @model.current.on "reset", @renderCurrent, @
    @model.backlog.on "reset", @renderBacklog, @

  renderTitle: ->
    @$el.html @template @model.attributes # this is unsave, may override stories elements
    @

  renderIcebox: ->
    (new StoriesView collection: @model.icebox, el: @$(".icebox .stories")).render()
    @

  renderCurrent: ->
    (new IterationsView collection: @model.current, el: @$(".current")).render()
    @

  renderBacklog: ->
    (new IterationsView collection: @model.backlog, el: @$(".backlog")).render()
    @


class StoryItemView extends Backbone.View

  tagName: "article"
  className: "story"
  templateURL: "templates/story-item.html"

  render: ->
    @$el.html @template @model.attributes # story.toJSON is overridden
    @


class StoriesView extends Backbone.View
  
  events:
    "click .story": "open"
  
  initialize: (options) ->
    @collection.on "reset", @render, @

  render: ->
    @$el.empty()
    for story in @collection.models
      @$el.append (new StoryItemView model: story).render().el
    @
    
  open: ->
    @$el.toggleClass "open"


class IterationItemView extends Backbone.View

  tagName: "section"
  className: "iteration"
  templateURL: "templates/iteration-item.html"

  render: ->
    @$el.html @template @model.attributes # story.toJSON is overridden
    (new StoriesView collection: @model.stories, el: @$(".stories")).render()
    @


class IterationsView extends Backbone.View

  initialize: (options) ->
    @collection.on "reset", @render, @

  render: ->
    @$el.empty()
    for iteration in @collection.models
      @$el.append (new IterationItemView model: iteration).render().el
    @


@app = window.app ? {}
@app.views =
  ProjectItemView: ProjectItemView
  ProjectsView: ProjectsView
  ProjectView: ProjectView
  StoryItemView: StoryItemView
  StoriesView: StoriesView
  IterationItemView: IterationItemView
  IterationsView: IterationsView
  AppView: AppView
  LoginView: LoginView
  ErrorView: ErrorView
  AppHeaderView: AppHeaderView
  AppFooterView: AppFooterView

