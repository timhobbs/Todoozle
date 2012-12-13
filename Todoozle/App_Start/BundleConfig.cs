using System.Web;
using System.Web.Optimization;

namespace Todoozle {

    public class BundleConfig {

        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles) {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/jquery.cookie.js"));

            bundles.Add(new ScriptBundle("~/bundles/backbone").Include(
                        "~/Scripts/underscore.js",
                        "~/Scripts/backbone.js",
                        "~/Scripts/handlebars.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                        "~/Scripts/bootstrap.js",
                        "~/Scripts/app.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                        "~/Content/bootstrap.css",
                        "~/Content/bootstrap-responsive.css",
                        "~/Content/font-awesome.css",
                        "~/Content/site.css"));
        }
    }
}