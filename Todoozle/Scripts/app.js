(function() {
  var Todo, Todos, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.app = (_ref = window.app) != null ? _ref : {};

  Todo = (function(_super) {

    __extends(Todo, _super);

    function Todo() {
      this.isComplete = __bind(this.isComplete, this);

      this.markIncomplete = __bind(this.markIncomplete, this);

      this.markComplete = __bind(this.markComplete, this);
      return Todo.__super__.constructor.apply(this, arguments);
    }

    Todo.prototype.urlRoot = "/api/todos";

    Todo.prototype.idAttribute = "Id";

    Todo.prototype.markComplete = function() {
      var completedOn;
      completedOn = (new Date).getTime();
      this.set({
        IsComplete: true,
        CompletedOn: completedOn
      });
      return console.log("set", this.set);
    };

    Todo.prototype.markIncomplete = function() {
      return this.set({
        IsComplete: false,
        CompletedOn: null
      });
    };

    Todo.prototype.isComplete = function() {
      return this.attributes.IsComplete;
    };

    return Todo;

  })(Backbone.Model);

  Todos = (function(_super) {

    __extends(Todos, _super);

    function Todos() {
      return Todos.__super__.constructor.apply(this, arguments);
    }

    Todos.prototype.model = Todo;

    Todos.prototype.url = "/api/todos";

    Todos.prototype.comparator = function(todo) {
      return todo.get("CreatedOn");
    };

    Todos.prototype.completeTodos = function() {
      var todos;
      todos = this.filter(function(todo) {
        return todo.isComplete();
      });
      return _.sortBy(todos, function(todo) {
        return todo.get("CreatedOn");
      });
    };

    Todos.prototype.incompleteTodos = function() {
      var todos;
      todos = this.reject(function(todo) {
        return todo.isComplete();
      });
      return _.sortBy(todos, function(todo) {
        return todo.get("CreatedOn");
      });
    };

    return Todos;

  })(Backbone.Collection);

  jQuery(function() {
    var AppView, NewTodo, TodoItem, TodoItems, TodoList, todoList,
      _this = this;
    AppView = (function(_super) {

      __extends(AppView, _super);

      function AppView() {
        this.render = __bind(this.render, this);

        this.initialize = __bind(this.initialize, this);
        return AppView.__super__.constructor.apply(this, arguments);
      }

      AppView.prototype.el = "#content";

      AppView.prototype.initialize = function() {
        this.collection.fetch();
        this.subviews = [
          new TodoList({
            collection: this.collection
          }), new NewTodo({
            collection: this.collection
          })
        ];
        return this.render();
      };

      AppView.prototype.render = function() {
        var subview, _i, _len, _ref1;
        _ref1 = this.subviews;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          subview = _ref1[_i];
          $(this.el).append(subview.render().el);
        }
        return this;
      };

      return AppView;

    })(Backbone.View);
    TodoList = (function(_super) {

      __extends(TodoList, _super);

      function TodoList() {
        this.render = __bind(this.render, this);

        this.initialize = __bind(this.initialize, this);
        return TodoList.__super__.constructor.apply(this, arguments);
      }

      TodoList.prototype.el = "#todo-list";

      TodoList.prototype.initialize = function() {
        this.collection.bind("all", this.render, this);
        return this.subviews = [
          new TodoItems({
            collection: this.collection
          })
        ];
      };

      TodoList.prototype.render = function() {
        var subview, _i, _len, _ref1;
        _ref1 = this.subviews;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          subview = _ref1[_i];
          $(this.el).append(subview.render().el);
        }
        return this;
      };

      return TodoList;

    })(Backbone.View);
    TodoItems = (function(_super) {

      __extends(TodoItems, _super);

      function TodoItems() {
        this.render = __bind(this.render, this);

        this.initialize = __bind(this.initialize, this);
        return TodoItems.__super__.constructor.apply(this, arguments);
      }

      TodoItems.prototype.tagName = "ul";

      TodoItems.prototype.initialize = function() {
        return this.collection.bind("all", this.render, this);
      };

      TodoItems.prototype.render = function() {
        var item, todoItem, _i, _j, _len, _len1, _ref1, _ref2;
        $(this.el).empty();
        _ref1 = this.collection.completeTodos();
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          item = _ref1[_i];
          todoItem = new TodoItem({
            model: item
          });
          $(this.el).append(todoItem.render().el);
        }
        _ref2 = this.collection.incompleteTodos();
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          item = _ref2[_j];
          todoItem = new TodoItem({
            model: item
          });
          $(this.el).append(todoItem.render().el);
        }
        return this;
      };

      return TodoItems;

    })(Backbone.View);
    TodoItem = (function(_super) {

      __extends(TodoItem, _super);

      function TodoItem() {
        this.completeItem = __bind(this.completeItem, this);

        this.cancelUpdate = __bind(this.cancelUpdate, this);

        this.updateItem = __bind(this.updateItem, this);

        this.editItem = __bind(this.editItem, this);

        this.render = __bind(this.render, this);
        return TodoItem.__super__.constructor.apply(this, arguments);
      }

      TodoItem.prototype.className = "item";

      TodoItem.prototype.tagName = "li";

      TodoItem.prototype.template = Handlebars.compile($("#list-item-template").html());

      TodoItem.prototype.completeTemplate = Handlebars.compile($("#list-item-complete-template").html());

      TodoItem.prototype.events = {
        "click .edit": "editItem",
        "keypress .edit-todo": "updateItem",
        "keyup .edit-todo": "cancelUpdate",
        "click .destroy": "destroy",
        "click .checkbox input": "completeItem"
      };

      TodoItem.prototype.render = function() {
        var d, json, utc;
        if (this.model.isComplete()) {
          json = this.model.toJSON();
          d = new Date(json.CompletedOn);
          utc = d.getTime() + (d.getTimezoneOffset() * 60000);
          json.CompletedOn = new Date(utc);
          $(this.el).html(this.completeTemplate(json));
        } else {
          $(this.el).html(this.template(this.model.toJSON()));
        }
        return this;
      };

      TodoItem.prototype.editItem = function() {
        $(this.el).html(this.make("input", {
          type: "text",
          "class": "edit-todo",
          value: this.model.get("Name")
        }));
        return $(".edit-todo").focus().select();
      };

      TodoItem.prototype.updateItem = function(event) {
        if (event.keyCode === 13) {
          this.model.save({
            Name: this.$(".edit-todo").val()
          });
          return this.render();
        }
      };

      TodoItem.prototype.cancelUpdate = function(event) {
        if (event.keyCode === 27) {
          return this.render();
        }
      };

      TodoItem.prototype.completeItem = function(event) {
        var checked;
        checked = $(event.target).prop("checked");
        console.log("checked", checked, this.model);
        if (checked) {
          this.model.markComplete();
        } else {
          this.model.markIncomplete();
        }
        this.model.save();
        return this.render();
      };

      TodoItem.prototype.destroy = function(event) {
        event.preventDefault();
        if (confirm("Are you sure you want to delete this item?")) {
          return this.model.destroy();
        }
      };

      return TodoItem;

    })(Backbone.View);
    NewTodo = (function(_super) {

      __extends(NewTodo, _super);

      function NewTodo() {
        this.submitForm = __bind(this.submitForm, this);

        this.focus = __bind(this.focus, this);

        this.keypress = __bind(this.keypress, this);

        this.render = __bind(this.render, this);
        return NewTodo.__super__.constructor.apply(this, arguments);
      }

      NewTodo.prototype.tagName = "form";

      NewTodo.prototype.className = "form-inline";

      NewTodo.prototype.template = Handlebars.compile($("#new-todo-template").html());

      NewTodo.prototype.events = {
        "keypress #new-todo": "keypress",
        "click button.btn": "submitForm"
      };

      NewTodo.prototype.render = function() {
        $(this.el).html(this.template());
        return this;
      };

      NewTodo.prototype.keypress = function(event) {
        if (event.keycode === 13) {
          return this.submitForm();
        }
      };

      NewTodo.prototype.focus = function() {
        return $("#new-todo").val("").focus();
      };

      NewTodo.prototype.submitForm = function(event) {
        var newTodo;
        event.preventDefault();
        newTodo = {
          Name: $("#new-todo").val()
        };
        console.log(newTodo, this.collection);
        if (this.collection.create(newTodo)) {
          console.log(newTodo);
          return this.focus();
        }
      };

      return NewTodo;

    })(Backbone.View);
    todoList = new AppView({
      collection: new Todos
    });
    $("#hero-close").click(function() {
      $.cookie("hero-closed", "true");
      return $(".hero-unit").slideUp("fast");
    });
    if (!$.cookie("hero-closed")) {
      return $(".hero-unit").show();
    }
  });

}).call(this);
