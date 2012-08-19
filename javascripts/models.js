(function() {
  var Auth, Iteration, Iterations, Project, Projects, Stories, Story, _ref,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Auth = (function(_super) {

    __extends(Auth, _super);

    function Auth() {
      Auth.__super__.constructor.apply(this, arguments);
    }

    Auth.prototype.url = app.util.apiURL("tokens/active");

    Auth.prototype.parse = function(response) {
      return Jath.parse({
        token: 'token/guid'
      }, response);
    };

    Auth.prototype.sync = function(method, model, options) {
      var params;
      params = {
        url: app.util.apiURL("tokens/active"),
        dataType: "xml",
        processData: true,
        type: "POST",
        data: model.toJSON()
      };
      return $.ajax(_.extend(params, options));
    };

    return Auth;

  })(Backbone.Model);

  Project = (function(_super) {

    __extends(Project, _super);

    function Project() {
      Project.__super__.constructor.apply(this, arguments);
    }

    Project.prototype.urlRoot = app.util.apiURL("projects");

    Project.prototype.initialize = function(options) {
      this.icebox = new Stories;
      this.current = new Iterations;
      return this.backlog = new Iterations;
    };

    Project.prototype.toJSON = function() {
      return {
        project: this.attributes
      };
    };

    Project.prototype.parse = function(response) {
      if ($.isXMLDoc(response)) {
        return Jath.parse({
          id: 'project/id',
          name: 'project/name'
        }, response);
      } else {
        return response;
      }
    };

    Project.prototype.fetchStories = function() {
      if (!this.isNew()) {
        this.icebox.url = app.util.apiURL("projects/" + this.id + "/stories");
        this.icebox.fetch({
          data: {
            filter: "state:unscheduled"
          }
        });
        this.current.url = app.util.apiURL("projects/" + this.id + "/iterations/current");
        this.current.fetch();
        this.backlog.url = app.util.apiURL("projects/" + this.id + "/iterations/backlog");
        return this.backlog.fetch();
      }
    };

    return Project;

  })(Backbone.Model);

  Projects = (function(_super) {

    __extends(Projects, _super);

    function Projects() {
      Projects.__super__.constructor.apply(this, arguments);
    }

    Projects.prototype.model = Project;

    Projects.prototype.url = app.util.apiURL("projects");

    Projects.prototype.parse = function(response) {
      return Jath.parse([
        "projects/project", {
          id: 'id',
          name: 'name'
        }
      ], response);
    };

    return Projects;

  })(Backbone.Collection);

  Story = (function(_super) {

    __extends(Story, _super);

    function Story() {
      Story.__super__.constructor.apply(this, arguments);
    }

    Story.prototype.toJSON = function() {
      return {
        story: this.story
      };
    };

    return Story;

  })(Backbone.Model);

  Stories = (function(_super) {

    __extends(Stories, _super);

    function Stories() {
      Stories.__super__.constructor.apply(this, arguments);
    }

    Stories.prototype.model = Story;

    Stories.prototype.parse = function(response) {
      return Jath.parse([
        "stories/story", {
          id: 'id',
          name: 'name'
        }
      ], response);
    };

    return Stories;

  })(Backbone.Collection);

  Iteration = (function(_super) {

    __extends(Iteration, _super);

    function Iteration() {
      Iteration.__super__.constructor.apply(this, arguments);
    }

    Iteration.prototype.initialize = function(options) {
      return this.stories = new Stories(this.get("stories"));
    };

    return Iteration;

  })(Backbone.Model);

  Iterations = (function(_super) {

    __extends(Iterations, _super);

    function Iterations() {
      Iterations.__super__.constructor.apply(this, arguments);
    }

    Iterations.prototype.model = Iteration;

    Iterations.prototype.parse = function(response) {
      return Jath.parse([
        "iterations/iteration", {
          id: 'id',
          number: 'number',
          stories: [
            "stories/story", {
              id: 'id',
              name: 'name'
            }
          ]
        }
      ], response);
    };

    return Iterations;

  })(Backbone.Collection);

  this.app = (_ref = window.app) != null ? _ref : {};

  this.app.Auth = Auth;

  this.app.Project = Project;

  this.app.Projects = Projects;

  this.app.Story = Story;

  this.app.Stories = Stories;

  this.app.Iteration = Iteration;

  this.app.Iterations = Iterations;

}).call(this);
