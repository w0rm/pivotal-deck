

class Auth extends Backbone.Model

  url: app.util.apiURL "tokens/active"

  parse: (response) ->
    Jath.parse token: 'token/guid', response

  sync: (method, model, options) ->
    # Override default sync method to handle api token retrieval
    # Should be triggered by saving auth model
    params =
      url: app.util.apiURL "tokens/active"
      dataType: "xml"
      processData: true
      type: "POST"
      data: model.toJSON()
    $.ajax _.extend(params, options)


class Project extends Backbone.Model

  urlRoot: app.util.apiURL "projects"

  initialize: (options) ->
    @icebox = new Stories
    @current = new Iterations
    @backlog = new Iterations

  toJSON: -> project: @attributes # for xml serialization on sync

  parse: (response) ->
    # If project.parse is called on model fetch,
    # then we need to parse xml.
    # If model is created on collection.fetch,
    # then we don't need to parse xml
    if $.isXMLDoc response
      Jath.parse id: 'project/id', name: 'project/name', response
    else
      response

  fetchStories: ->
    unless @isNew()
      # Ensure @id is available
      @icebox.url = app.util.apiURL "projects/#{@id}/stories"
      @icebox.fetch data: filter: "state:unscheduled" # Filter the stories in icebox
      @current.url = app.util.apiURL "projects/#{@id}/iterations/current"
      @current.fetch()
      @backlog.url = app.util.apiURL "projects/#{@id}/iterations/backlog"
      @backlog.fetch()


class Projects extends Backbone.Collection

  model: Project
  url: app.util.apiURL "projects"

  parse: (response) ->
    Jath.parse ["projects/project", id: 'id', name: 'name'], response


class Story extends Backbone.Model

  toJSON: -> story: @story # for xml serialization on sync


class Stories extends Backbone.Collection

  model: Story

  parse: (response) ->
    Jath.parse ["stories/story", id: 'id', name: 'name'], response


class Iteration extends Backbone.Model

  initialize: (options) ->
    @stories = new Stories @get("stories")


class Iterations extends Backbone.Collection

  model: Iteration

  parse: (response) ->
    Jath.parse [
      "iterations/iteration"
    ,
      id: 'id',
      number: 'number',
      stories: ["stories/story", id: 'id', name: 'name']
    ], response


@app = window.app ? {}
@app.Auth = Auth
@app.Project = Project
@app.Projects = Projects
@app.Story = Story
@app.Stories = Stories
@app.Iteration = Iteration
@app.Iterations = Iterations
