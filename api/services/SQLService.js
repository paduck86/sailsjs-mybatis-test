var Q = require('q');

var QueryService = require('../services/QueryService');

module.exports = {
  escape: function(str) {
    return str.replace(/[\'\;]/, "");
  },

  queryOnPromise: function( qry_mapper, qry_params ) {
    var sqlMapper = QueryService.getSqlMapper(qry_mapper, qry_params);
    sails.log.debug('sql ::: ' + sqlMapper.sql);
    sails.log.debug('params ::: ' + sqlMapper.parametros);
    return Q.denodeify(DB.query)(sqlMapper.sql, sqlMapper.parametros);
  }
};
