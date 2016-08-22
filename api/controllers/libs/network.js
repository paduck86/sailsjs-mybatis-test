module.exports = {
  get_ip : function(req, res) {
    var ip_addr = req.ip;
    if(typeof req.headers['x-forwarded-for'] !== 'undefined') {
      ip_addr = req.headers['x-forwarded-for'].replace(/unknown, /g, '').replace(/,.+$/, '');
    }

    return ip_addr.replace(/^::ffff:/, '');
  }
};
