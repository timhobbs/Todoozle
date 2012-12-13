using System;

namespace Todoozle.Models {

    public class TodoModel {

        public int Id { get; set; }

        public string Name { get; set; }

        public bool IsComplete { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime? CompletedOn { get; set; }

        public bool Deleted { get; set; }

        public DateTime? DeletedOn { get; set; }
    }
}