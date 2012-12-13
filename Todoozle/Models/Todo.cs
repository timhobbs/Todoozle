using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Massive;

namespace Todoozle.Models {

    public class Todo : DynamicModel {

        //you don't have to specify the connection - Massive will use the first one it finds in your config
        public Todo()
            : base("Todoozle", "Todo", "Id") {
        }

        public override void Validate(dynamic item) {
            ValidatesPresenceOf("Name");
        }
    }
}