(function() {
  var AppRouter,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    _this = this;

  AppRouter = (function(_super) {

    __extends(AppRouter, _super);

    function AppRouter() {
      AppRouter.__super__.constructor.apply(this, arguments);
    }

    AppRouter.prototype.routes = {
      '': 'redirect',
      'login': 'login',
      'projects': 'projects',
      'projects/:id': 'project'
    };

    AppRouter.prototype.redirect = function() {
      if (app.trackerToken == null) {
        return this.navigate("login", {
          trigger: true
        });
      } else {
        return this.navigate("projects", {
          trigger: true
        });
      }
    };

    AppRouter.prototype.login = function() {
      var auth,
        _this = this;
      auth = new app.Auth;
      (new app.views.LoginView({
        model: auth
      })).render();
      return auth.on("change", function() {
        if (auth.has("token")) {
          app.trackerToken = auth.get("token");
          return _this.navigate("projects", {
            trigger: true
          });
        }
      });
    };

    AppRouter.prototype.projects = function() {
      var projects;
      projects = new app.Projects;
      (new app.views.ProjectsView({
        collection: projects
      })).render();
      return projects.fetch();
    };

    AppRouter.prototype.project = function(id) {
      var project;
      project = new app.Project({
        id: id
      });
      (new app.views.ProjectView({
        model: project
      })).render();
      return project.fetch().done(function() {
        return project.fetchStories();
      });
    };

    return AppRouter;

  })(Backbone.Router);

  app.util.loadTemplates(app.views).done(function() {
    $(document).foundationAlerts();
    $(document).foundationButtons();
    $(document).tooltips();
    app.appRouter = new AppRouter;
    app.appView = (new app.views.AppView).render();
    $.ajaxSetup({
      statusCode: {
        403: function(e) {
          app.appView.renderError({
            message: "Authorization error, please enter correct credentials."
          });
          return app.appRouter.navigate("login", {
            trigger: true
          });
        }
      }
    });
    return Backbone.history.start();
  });

}).call(this);
