"use strict";
var system = require("system");
var webPage = require("webpage");
var page = webPage.create();
var fs = require("fs");

page.viewportSize = { width: 1920, height: 1200 };

system.args[1] = system.args[1].replace(system.args[3], "./src/");
system.args[2] = system.args[2].replace(system.args[3], "./src/");

page.open("file:///" + system.args[1], function(status) {
  page.render(system.args[2], { format: "png", quality: "80" });
  phantom.exit();
});
