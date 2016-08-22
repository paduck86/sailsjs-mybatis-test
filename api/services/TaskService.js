var Q = require('q');
var SQLService = require('./SQLService');
var debug = require("../controllers/libs/debug.js");

module.exports = {
    taskExecuteQuery: _taskExecuteQuery,
    taskAllSettled: _taskAllSettled,
    taskDefaultError: _taskDefaultError
};

function _taskExecuteQuery(sql_mapper, model) {
    sails.log.debug( '_taskExecuteQuery ::: ' + sql_mapper);
    var deferred = Q.defer();
    SQLService
    .queryOnPromise(
        sql_mapper,
        model
    ).then(function(result){
        sails.log.debug('_taskExecuteQuery(' + sql_mapper + ') results: ' , result);

        if(result.constructor.name === 'OkPacket') {
            _.extend(model.result, result);
            deferred.resolve(model);
        } else if (Array.isArray(result)) {
            //throw new CustomError(400, 'ER_CUSTOM_ERROR', 'error지롱~~');
            if( result.length<1 ){
                deferred.reject("ERR_NOT_FOUND_DATA");
            }else{
                model.result.resultmap = result;
                deferred.resolve(model);
            }
        }
    }).catch(function(e){
        sails.log.debug(e.stack);
        deferred.reject(e);
    });
    return deferred.promise;
}

function _taskAllSettled(req, res, model) {
    sails.log.debug( '_taskAllSettled ::: ');

    return res.send(
        200,
        debug.wrap(
            model.req,
            model.res,
            200,
            {
                results: model.result.resultmap || [],
                debug: {
                    status: undefined,
                    path: undefined,
                    ip: undefined,
                    listCount: model.result.resultmap.length || 0,
                    affectedRows: model.result.affectedRows || 0,
                    insertId: model.result.insertId || null,
                    serverStatus: model.result.serverStatus || 2,
                    warningCount: model.result.warningCount || 0,
                    message: model.result.message || "",
                    protocol41: model.result.protocol41 || true
                }
            }
        )
    );
}

function _taskDefaultError(req, res, err) {
    sails.log.debug( '_taskDefaultError ::: ');
    //var err_code = err;
    var tmpStatus = 400;

    res.status(tmpStatus);
    return res.send(tmpStatus, debug.wrap(req, res, (err.status || 500), err ));
}