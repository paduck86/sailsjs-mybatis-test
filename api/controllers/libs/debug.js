module.exports = {
  wrap: function(req, res, status, results) {
    var show = req.param("show") || "",
      lib_net,
      ip_addr;

    if(!results.debug) {
      results.debug = {};
    }

    if (status >= 400 || (show.indexOf("debug") > -1 && typeof results.length === "undefined")) {
      lib_net = require("./network.js");
      ip_addr = lib_net.get_ip(req);


      _.extend(results.debug, {"status": status, "path": req.url, "ip": ip_addr});
      /*results.debug = {
        "status": status,
        "path": req.url,
        "ip": ip_addr
      };*/

      if (status >= 400) {
        sails.log.error(results);
      }
    } else {
      delete results.debug;
    }

    return results;
  }
};
