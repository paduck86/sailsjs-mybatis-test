// dependencies external library
var Q = require('q');
var is = require("is_js");

// dependencies internal module(and service)
var debug = require("./libs/debug.js");
var SQLService = require('../services/SQLService');
var FileService = require('../services/FileService');
var ErrorHandler = require('../services/ErrorHandler');
var ValidatorService = require('../services/ValidatorService');


module.exports = {
  list : _list
};

function _list(req,res) {
  var ITEM_LIST_MODEL = {
      params: req.allParams(),
      req: req,
      res: res,
      count: req.param('count') || 1,
      results: []
  };


  Q.fcall(_taskValidateParams)      // 1. parameter 검증
      .spread(_taskSelectItem)      // 2. verify code 체킹
      .spread(_taskAllSettled)      // 3. 완료
      .catch(_taskDefaultError);    // ** default error excute

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //task method START
  function _taskValidateParams(){
    console.log( '_taskValidateParams ::: ');
    return Q.all([
      ValidatorService.validatePromise(
        {
          data:ITEM_LIST_MODEL,
          validator:[
            {key:'account_uuid' , validation:{ list:[{fnc:is.not.empty, code:'ER_UNDEFINED_PARAM_ERROR'}] }}
          ]
        }
      )
    ]);
  }

  function _taskSelectItem(){
    console.log( '_taskSelectItem ::: ');
    var deferred = Q.defer();
    SQLService
      .queryOnPromise(
        'item.list',
        ITEM_LIST_MODEL
      ).then(function(results){
      console.log('_taskSelect3DC results: ' , results);
      if( results.length<1 ){
        deferred.reject("ERR_NOT_FOUND_TD_DATA");
      }else{
        ITEM_LIST_MODEL.results = results;
        deferred.resolve(ITEM_LIST_MODEL);
      }
    }).catch(function(e){
      console.log(e);
      deferred.reject('ER_NETWORK_SELECT_ITEM');
    });
    return deferred.promise;
  }

  function _taskAllSettled(){
    console.log( '_taskAllSettled ::: ');
    return res.send(
      200,
      debug.wrap(
        ITEM_LIST_MODEL.req,
        ITEM_LIST_MODEL.res,
        200,
        {
          listCount: results.length,
          affectedRows: 0,
          insertId: ITEM_LIST_MODEL.td_no,
          serverStatus: 2,
          warningCount: 0,
          message: "",
          protocol41: true,
          results: ITEM_LIST_MODEL.results
        }
      )
    );

  }

  function _taskDefaultError(__err){
    console.log( '_taskDefaultError ::: ');
    var err_code = 'ERR_FAIL';
    var tmpStatus = 500;

    //  TODO : ERROR format 정규화 및 response 처리
    // ER_SECRET_ERROR , ER_VERIFY_ERROR , ER_BAD_BLANK_ERROR|ER_UNDEFINED_PARAM_ERROR ,
    // ER_NOT_MATCH : account_uuid , ER_NOT_MATCH : make_category_name , ER_UNDEFINED Error: package.bin is invalid format

    try{
      /*if( __err.stack.indexOf('ER_EMPTY_FILE')!==-1 ){
        tmpStatus = 400;
        err_code = 'ER_EMPTY_FILE';
      }else if(__err.stack.indexOf('ER_NOT_MATCH_MEMBER_ID_AND_ACCOUNT_ID')!==-1){
        tmpStatus = 400;
        err_code = 'ER_NOT_MATCH_MEMBER_ID_AND_ACCOUNT_ID';
      }else if( __err.stack.indexOf(ErrorHandler.NOT_FOUND_DATA.code + ": make_category_name ")!==-1 ){
        tmpStatus = 400;
        err_code = ErrorHandler.NOT_FOUND_DATA.code + ": make_category_name ";
      }*/
      tmpStatus = 400;
      err_code = __err;
    }catch(e){
    }

    res.status(tmpStatus);
    return res.send(tmpStatus, debug.wrap(req, res, (__err.status || 500), {code:err_code} ));
  }
}
