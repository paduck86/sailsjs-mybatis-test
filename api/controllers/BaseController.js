// dependencies external library
var Q = require('q');
var is = require("is_js");

// dependencies internal module(and service)
var debug = require("./libs/debug.js");
var SQLService = require('../services/SQLService');
var FileService = require('../services/FileService');
var ErrorHandler = require('../services/ErrorHandler');
var ValidatorService = require('../services/ValidatorService');
var TaskService = require('../services/TaskService');

var BaseController = function() {};
BaseController.prototype = {
    taskValidateParams : _taskValidateParams,
    taskQueryTest : _taskQueryTest,
    taskAllSettled : _taskAllSettled,
    taskDefaultError : _taskDefaultError
};

module.exports = BaseController;

/*module.exports = {
    taskValidateParams : _taskValidateParams,
    taskQueryTest : _taskQueryTest,
    taskAllSettled : _taskAllSettled,
    taskDefaultError : _taskDefaultError
};*/

function _taskValidateParams(model,validator) {
    return ValidatorService.validatePromise({
        data: _.omit(model, ['req','res','results']),
        validator:validator
    });
}

function _taskQueryTest(sql_mapper, model) {
    return TaskService
    .taskExecuteQuery(
        sql_mapper,
        model
    );
}

function _taskAllSettled(req, res, model){
    return TaskService
    .taskAllSettled(
        req,
        res,
        model
    );
}

function _taskDefaultError(req, res, __err){
    return TaskService
    .taskDefaultError(
        req,
        res,
        __err
    );
}



