(function() {
  var AppFooterView, AppHeaderView, AppView, IterationItemView, IterationsView, LoginView, ProjectItemView, ProjectView, ProjectsView, StoriesView, StoryItemView, _ref,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  AppView = (function(_super) {

    __extends(AppView, _super);

    function AppView() {
      AppView.__super__.constructor.apply(this, arguments);
    }

    AppView.prototype.el = '#app';

    AppView.prototype.templateURL = "templates/app.html";

    AppView.prototype.initialize = function(options) {
      this.headerView = new AppHeaderView;
      return this.footerView = new AppFooterView;
    };

    AppView.prototype.render = function() {
      this.$el.html(this.template());
      _.invoke([this.headerView, this.footerView], "render");
      return this;
    };

    return AppView;

  })(Backbone.View);

  AppHeaderView = (function(_super) {

    __extends(AppHeaderView, _super);

    function AppHeaderView() {
      AppHeaderView.__super__.constructor.apply(this, arguments);
    }

    AppHeaderView.prototype.el = 'header';

    AppHeaderView.prototype.templateURL = "templates/app-header.html";

    AppHeaderView.prototype.render = function() {
      this.$el.html(this.template());
      return this;
    };

    return AppHeaderView;

  })(Backbone.View);

  AppFooterView = (function(_super) {

    __extends(AppFooterView, _super);

    function AppFooterView() {
      AppFooterView.__super__.constructor.apply(this, arguments);
    }

    AppFooterView.prototype.el = 'footer';

    AppFooterView.prototype.templateURL = "templates/app-footer.html";

    AppFooterView.prototype.render = function() {
      this.$el.html(this.template());
      return this;
    };

    return AppFooterView;

  })(Backbone.View);

  LoginView = (function(_super) {

    __extends(LoginView, _super);

    function LoginView() {
      LoginView.__super__.constructor.apply(this, arguments);
    }

    LoginView.prototype.el = '#page';

    LoginView.prototype.templateURL = "templates/login.html";

    LoginView.prototype.events = {
      "submit form": "login"
    };

    LoginView.prototype.initialize = function(options) {
      var _this = this;
      return this.model.on("error", function() {
        return _this.$("[type=submit]").removeAttr("disabled");
      });
    };

    LoginView.prototype.render = function() {
      this.$el.html(this.template());
      return this;
    };

    LoginView.prototype.login = function(e) {
      var res;
      e.preventDefault();
      this.$("[type=submit]").attr("disabled", "disabled");
      res = this.model.save({
        username: this.$("[name=username]").val(),
        password: this.$("[name=password]").val()
      });
      return this;
    };

    return LoginView;

  })(Backbone.View);

  ProjectsView = (function(_super) {

    __extends(ProjectsView, _super);

    function ProjectsView() {
      ProjectsView.__super__.constructor.apply(this, arguments);
    }

    ProjectsView.prototype.el = '#page';

    ProjectsView.prototype.initialize = function(options) {
      return this.collection.on("reset", this.render, this);
    };

    ProjectsView.prototype.render = function() {
      var project, _i, _len, _ref;
      this.$el.empty();
      _ref = this.collection.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        project = _ref[_i];
        this.$el.append((new ProjectItemView({
          model: project
        })).render().el);
      }
      return this;
    };

    return ProjectsView;

  })(Backbone.View);

  ProjectItemView = (function(_super) {

    __extends(ProjectItemView, _super);

    function ProjectItemView() {
      ProjectItemView.__super__.constructor.apply(this, arguments);
    }

    ProjectItemView.prototype.tagName = "article";

    ProjectItemView.prototype.className = "project";

    ProjectItemView.prototype.templateURL = "templates/project-item.html";

    ProjectItemView.prototype.render = function() {
      this.$el.html(this.template(this.model.attributes));
      return this;
    };

    return ProjectItemView;

  })(Backbone.View);

  ProjectView = (function(_super) {

    __extends(ProjectView, _super);

    function ProjectView() {
      ProjectView.__super__.constructor.apply(this, arguments);
    }

    ProjectView.prototype.el = '#page';

    ProjectView.prototype.templateURL = "templates/project.html";

    ProjectView.prototype.initialize = function(options) {
      this.model.on("change", this.renderTitle, this);
      this.model.icebox.on("reset", this.renderIcebox, this);
      this.model.current.on("reset", this.renderCurrent, this);
      return this.model.backlog.on("reset", this.renderBacklog, this);
    };

    ProjectView.prototype.renderTitle = function() {
      this.$el.html(this.template(this.model.attributes));
      return this;
    };

    ProjectView.prototype.renderIcebox = function() {
      (new StoriesView({
        collection: this.model.icebox,
        el: this.$(".icebox .stories")
      })).render();
      return this;
    };

    ProjectView.prototype.renderCurrent = function() {
      (new IterationsView({
        collection: this.model.current,
        el: this.$(".current")
      })).render();
      return this;
    };

    ProjectView.prototype.renderBacklog = function() {
      (new IterationsView({
        collection: this.model.backlog,
        el: this.$(".backlog")
      })).render();
      return this;
    };

    return ProjectView;

  })(Backbone.View);

  StoryItemView = (function(_super) {

    __extends(StoryItemView, _super);

    function StoryItemView() {
      StoryItemView.__super__.constructor.apply(this, arguments);
    }

    StoryItemView.prototype.tagName = "article";

    StoryItemView.prototype.className = "story";

    StoryItemView.prototype.templateURL = "templates/story-item.html";

    StoryItemView.prototype.render = function() {
      this.$el.html(this.template(this.model.attributes));
      return this;
    };

    return StoryItemView;

  })(Backbone.View);

  StoriesView = (function(_super) {

    __extends(StoriesView, _super);

    function StoriesView() {
      StoriesView.__super__.constructor.apply(this, arguments);
    }

    StoriesView.prototype.initialize = function(options) {
      return this.collection.on("reset", this.render, this);
    };

    StoriesView.prototype.render = function() {
      var story, _i, _len, _ref;
      this.$el.empty();
      _ref = this.collection.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        story = _ref[_i];
        this.$el.append((new StoryItemView({
          model: story
        })).render().el);
      }
      return this;
    };

    return StoriesView;

  })(Backbone.View);

  IterationItemView = (function(_super) {

    __extends(IterationItemView, _super);

    function IterationItemView() {
      IterationItemView.__super__.constructor.apply(this, arguments);
    }

    IterationItemView.prototype.tagName = "section";

    IterationItemView.prototype.className = "iteration";

    IterationItemView.prototype.templateURL = "templates/iteration-item.html";

    IterationItemView.prototype.render = function() {
      this.$el.html(this.template(this.model.attributes));
      (new StoriesView({
        collection: this.model.stories,
        el: this.$(".stories")
      })).render();
      return this;
    };

    return IterationItemView;

  })(Backbone.View);

  IterationsView = (function(_super) {

    __extends(IterationsView, _super);

    function IterationsView() {
      IterationsView.__super__.constructor.apply(this, arguments);
    }

    IterationsView.prototype.initialize = function(options) {
      return this.collection.on("reset", this.render, this);
    };

    IterationsView.prototype.render = function() {
      var iteration, _i, _len, _ref;
      this.$el.empty();
      _ref = this.collection.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        iteration = _ref[_i];
        this.$el.append((new IterationItemView({
          model: iteration
        })).render().el);
      }
      return this;
    };

    return IterationsView;

  })(Backbone.View);

  this.app = (_ref = window.app) != null ? _ref : {};

  this.app.views = {
    ProjectItemView: ProjectItemView,
    ProjectsView: ProjectsView,
    ProjectView: ProjectView,
    StoryItemView: StoryItemView,
    StoriesView: StoriesView,
    IterationItemView: IterationItemView,
    IterationsView: IterationsView,
    AppView: AppView,
    LoginView: LoginView,
    AppHeaderView: AppHeaderView,
    AppFooterView: AppFooterView
  };

}).call(this);
