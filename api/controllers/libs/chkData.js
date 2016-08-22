module.exports = {
  chkParam: function(req, res, arr_params, next) {

    var debug = require("./debug.js"),
      len_arr = arr_params.length,
      i, param, err, err_code,
      status = 501;

    for (i = 0; i < len_arr; i++) {
      param = arr_params[i];
      if (typeof param === 'undefined') {
        //console.log(i);
        err_code = "ER_UNDEFINED_PARAM_ERROR";
      } else if (param === '') {
        err_code = "ER_BAD_BLANK_ERROR";
      }
      if (err_code) {
        err = {
          code: err_code,
          index: 0
        };
        status = 400;
        //return res.send(status, err);
        return res.send(status, debug.wrap(req, res, status, err));
      }
    }
    if (!err) {
      return next();
    }
  },
  isValue : function(param){
    var result;
    if(typeof param === 'undefined' || param === '' || !param){
      result = false;
    }else{
      result = true;
    }
    return result;
  },
  convertStatus : function(status){
    var status_type = ['activated', 'disabled', 'ready', 'deleted'],
        index = status;

    if(isNaN(index)){ return 'error';}
    if(index < 0 || index >= status_type.length){ return 'error';}

    return status_type[index];
  }
};
