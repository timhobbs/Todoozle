@app = window.app ? {}

class Todo extends Backbone.Model
    urlRoot: "/api/todos"
    idAttribute: "Id"
    markComplete: =>
        completedOn = (new Date).getTime()
        @set IsComplete: true, CompletedOn: completedOn
        console.log "set", @set
    markIncomplete: =>
        @set IsComplete: false, CompletedOn: null
    isComplete: =>
        @attributes.IsComplete

class Todos extends Backbone.Collection
    model: Todo
    url: "/api/todos"
    comparator: (todo) ->
        todo.get("CreatedOn")
    completeTodos: ->
        todos = @filter (todo) ->
            todo.isComplete()
        _.sortBy todos, (todo) ->
            todo.get("CreatedOn")
    incompleteTodos: ->
        todos = @reject (todo) ->
            todo.isComplete()
        _.sortBy todos, (todo) ->
            todo.get("CreatedOn")

jQuery ->
    class AppView extends Backbone.View
        el: "#content"
        initialize: =>
            @collection.fetch()
            @subviews = [
                new TodoList collection: @collection
                new NewTodo collection: @collection
            ]
            @render()
        render: =>
            for subview in @subviews
                $(@el).append subview.render().el
            @

    class TodoList extends Backbone.View
        el: "#todo-list"
        initialize: =>
            @collection.bind "all", @render, @
            @subviews = [
                new TodoItems collection: @collection
            ]
        render: =>
            $(@el).append subview.render().el for subview in @subviews
            @

    class TodoItems extends Backbone.View
        tagName: "ul"
        initialize: =>
            @collection.bind "all", @render, @
        render: =>
            $(@el).empty()
            for item in @collection.completeTodos()
                todoItem = new TodoItem model: item
                $(@el).append todoItem.render().el
            for item in @collection.incompleteTodos()
                todoItem = new TodoItem model: item
                $(@el).append todoItem.render().el
            @

    class TodoItem extends Backbone.View
        className: "item"
        tagName: "li"
        template: Handlebars.compile($("#list-item-template").html())
        completeTemplate: Handlebars.compile($("#list-item-complete-template").html())
        events:
            "click .edit": "editItem"
            "keypress .edit-todo": "updateItem"
            "keyup .edit-todo": "cancelUpdate"
            "click .destroy": "destroy"
            "click .checkbox input": "completeItem"
        render: =>
            if (@model.isComplete())
                json = @model.toJSON()
                d = new Date(json.CompletedOn)
                utc = d.getTime() + (d.getTimezoneOffset() * 60000)
                json.CompletedOn = new Date(utc)
                $(@el).html @completeTemplate(json)
            else
                $(@el).html @template(@model.toJSON())
            @
        editItem: =>
            $(@el).html @make "input", type: "text", class: "edit-todo", value: @model.get("Name")
            $(".edit-todo").focus().select()
        updateItem: (event) =>
            if (event.keyCode is 13) # ENTER
                @model.save Name: @$(".edit-todo").val()
                @render()
        cancelUpdate: (event) =>
            if (event.keyCode is 27) #ESC
                @render()
        completeItem: (event) =>
            checked = $(event.target).prop("checked")
            console.log "checked", checked, @model
            if (checked)
                @model.markComplete()
            else
                @model.markIncomplete()
            @model.save()
            @render()
        destroy: (event) ->
            event.preventDefault()
            if (confirm "Are you sure you want to delete this item?")
                @model.destroy()

    class NewTodo extends Backbone.View
        tagName: "form"
        className: "form-inline"
        template: Handlebars.compile($("#new-todo-template").html())
        events:
            "keypress #new-todo": "keypress"
            "click button.btn": "submitForm"
        render: =>
            $(@el).html @template()
            @
        keypress: (event) =>
            if (event.keycode == 13) # ENTER key
                @submitForm()
        focus: =>
            $("#new-todo").val("").focus();
        submitForm: (event) =>
            event.preventDefault()
            newTodo = { Name: $("#new-todo").val() }
            console.log newTodo, @collection
            if @collection.create(newTodo)
                console.log newTodo
                @focus()

    todoList = new AppView collection: new Todos

    $("#hero-close").click =>
        $.cookie("hero-closed", "true")
        $(".hero-unit").slideUp("fast")

    if (!$.cookie("hero-closed"))
        $(".hero-unit").show()