using System;
using System.Collections.Generic;
using System.Web.Http;
using Todoozle.Models;

namespace Todoozle.Controllers {

    public class TodosController : ApiController {

        // GET api/values
        public IEnumerable<TodoModel> Get() {
            var items = new List<TodoModel>();
            dynamic table = new Todo();
            var list = table.All(where: "WHERE Deleted = 0");
            foreach (dynamic d in list) {
                items.Add(DynamicToModel(d));
            }

            return items;
        }

        // GET api/values/5
        public TodoModel Get(int id) {
            dynamic table = new Todo();
            var item = table.First(Id: id);
            if (item == null) return null;

            return DynamicToModel(item);
        }

        // POST api/values
        public void Post([FromBody]NewTodo todo) {
            dynamic table = new Todo();
            var item = new { Name = todo.Name, CreatedOn = DateTime.Now };
            table.Insert(item);
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]TodoItem todo) {
            dynamic table = new Todo();
            var completed = new Nullable<DateTime>();
            if (todo.IsComplete) completed = DateTime.Now;
            var item = new {
                Name = todo.Name,
                IsComplete = todo.IsComplete,
                CompletedOn = completed
            };
            table.Update(item, id);
        }

        // DELETE api/values/5
        public void Delete(int id) {
            dynamic table = new Todo();
            var item = new { Deleted = true, DeletedOn = DateTime.Now };
            table.Update(item, id);
        }

        private TodoModel DynamicToModel(dynamic d) {
            return new TodoModel {
                Id = d.Id,
                Name = d.Name,
                IsComplete = d.IsComplete,
                CreatedOn = d.CreatedOn,
                CompletedOn = d.CompletedOn,
            };
        }
    }
}