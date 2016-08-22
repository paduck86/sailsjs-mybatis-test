// dependencies external library
var Q = require('q');
var is = require("is_js");

// dependencies internal module(and service)
var BaseController = require("./BaseController");
var debug = require("./libs/debug.js");
var chkData    = require("./libs/chkData.js");
var SQLService = require('../services/SQLService');
var TaskService = require('../services/TaskService');
var FileService = require('../services/FileService');
var ErrorHandler = require('../services/ErrorHandler');
var ValidatorService = require('../services/ValidatorService');
var QueryService = require('../services/QueryService');
var BaseModel = require('./libs/BaseModel');

var TestController = {
    iftest1 : _iftest1,
    iftest2 : _iftest2,
    fortest : _fortest_promise, // _fortest_before / _fortest_callback / _fortest_promise / _fortest_complete
    choosetest : _choosetest,
    wheretest : _wheretest,
    insertonetest : _insertonetest,
    insertmanytest : _insertmanytest,
    replacemanytest : _replacemanytest,
    updatetest : _updatetest,
    updatesettest : _updatesettest
};

TestController.prototype = new BaseController();
TestController.constructor = TestController;

//module.exports = _.extend({}, TestController, BaseController);
module.exports = TestController;

function _iftest1(req, res) {
    sails.log.debug( '================ 1. IF 테스트 ================');
    var IF_TEST1_MODEL = {
        params: req.allParams(),
        req: req,
        res: res,
        count: req.param('count') || 1,
        sql_mapper: 'test.iftest1',

        /* base model 로 빼기~~ */
        result: {
            listCount: undefined,
            affectedRows: undefined,
            changedRows: undefined,
            fieldCount: undefined,
            insertId: undefined,
            protocol41: undefined,
            serverStatus: undefined,
            warningCount: undefined,
            message: undefined,
            resultmap: []
        }
    };

    Q.fcall(_taskValidateParams)    // 1. parameter 검증
        .then(_taskQueryTest)       // 2. query test
        .then(_taskAllSettled)      // 3. 완료
        .catch(_taskDefaultError);  // ** default error excute

    function _taskValidateParams() {
        return ValidatorService.validatePromise({
            data: _.omit(IF_TEST1_MODEL, ['req','res','results']),
            validator:[
                {key:'count' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                                                  {fnc:is.not.empty, code:'ER_UNDEFINED_PARAM_ERROR'}] }},
                {key:'sql_mapper' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                                                       {fnc:is.not.empty, code:'ER_UNDEFINED_PARAM_ERROR'}] }}
            ]
        });
    }

    function _taskQueryTest(){
        var sql_mapper = IF_TEST1_MODEL.sql_mapper;
        return TaskService
            .taskExecuteQuery(
                sql_mapper, /* test.iftest1 */
                IF_TEST1_MODEL
            );
    }

    function _taskAllSettled(){
        return TaskService
            .taskAllSettled(
                req,
                res,
                IF_TEST1_MODEL
            );

    }

    function _taskDefaultError(__err){
        return TaskService
            .taskDefaultError(
                req,
                res,
                __err
            );
    }
}

function _iftest2(req, res) {
    sails.log.debug( '================ 2. IF 테스트 - 다중비교 & 값비교 ================');
    var IF_TEST2_MODEL = {
        params: req.allParams(),
        req: req,
        res: res,
        count:req.param('count'),
        first_name: req.param('first_name'),
        gender: req.param('gender'),
        sql_mapper: 'test.iftest2',
        result: {
            listCount: undefined,
            affectedRows: undefined,
            changedRows: undefined,
            fieldCount: undefined,
            insertId: undefined,
            protocol41: undefined,
            serverStatus: undefined,
            warningCount: undefined,
            message: undefined,
            resultmap: []
        }
    };

    Q.fcall(_taskValidateParams)    // 1. parameter 검증
        .then(_taskQueryTest)       // 2. query test
        .then(_taskAllSettled)      // 3. 완료
        .catch(_taskDefaultError);  // ** default error excute

    function _taskValidateParams() {
        return ValidatorService.validatePromise({
            data: _.omit(IF_TEST2_MODEL, ['req','res','results']),
            validator:[
                {key:'count' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                                                  {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }},
                {key:'gender' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                                                   {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }},
                {key:'first_name' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                                                       {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }},
                {key:'sql_mapper' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                                                       {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }}
            ]
        });
    }

    function _taskQueryTest(){
        var sql_mapper = IF_TEST2_MODEL.sql_mapper;
        return TaskService
        .taskExecuteQuery(
            sql_mapper, /* test.iftest2 */
            IF_TEST2_MODEL
        );
    }

    function _taskAllSettled(){
        return TaskService
        .taskAllSettled(
            req,
            res,
            IF_TEST2_MODEL
        );

    }

    function _taskDefaultError(__err){
        return TaskService
        .taskDefaultError(
            req,
            res,
            __err
        );
    }


}

function _fortest_before(req, res) {
    sails.log.debug( '================ 3. FOR 테스트 - BEFORE ================');

    // 1. model 정의
    var sqry="",
        fqry="",
        wqry="",
        lqry="",
        qry="",
        count,
        first_name,
        params=[],
        error={},
        status,
        rtn_val={},
        show;

    count       = req.param('count') || 1;
    first_name  = req.param('first_name');
    status      = 501;

    // 2. 필수값 체크
    chkData.chkParam(req, res, [count, first_name], function () {

        // 3. 쿼리작성
        sqry += "SELECT emp_no ";
        sqry += "     , birth_date ";
        sqry += "     , first_name ";
        sqry += "     , last_name ";
        sqry += "     , gender ";
        sqry += "     , hire_date ";

        fqry += "  FROM employees ";

        wqry += " WHERE first_name in (";

        var first_name_arr = first_name.split(',');
        for (var i = 0, length = first_name_arr.length; i < length; i++) {
            if(i === length - 1) {
                wqry += "?";
            } else {
                wqry += "?,";
            }

            params.push(first_name_arr[i]);
        }
        wqry += ") ";

        if (count) {
            lqry += " LIMIT ? ";
            params.push(Number(count));
        }

        qry = sqry + fqry + wqry + lqry;

        sails.log.debug('sql ::: ' + qry);
        sails.log.debug('params ::: ' + params);

        // 4. 실행
        DB.query(qry, params, function (err, result) {
           if(err) {
               status = 500;
               return res.send( debug.wrap( req, res, status, err ) );
           }

           if(result.length<1) {
               status = 400;

               error = ErrorHandler.NOT_FOUND_DATA;
               return res.send( debug.wrap( req, res, status, error ));
           } else {
               rtn_val.results = result;
               status = 200;
               return res.send( debug.wrap( req, res, status, rtn_val ));
           }
        });

    });
}

function _fortest_callback(req, res) {
    sails.log.debug( '================ 3. FOR 테스트 - CALLBACK ================');

    // 1. 모델정의
    var rtn_val = {};
    var status = 500;

    var FOR_TEST_MODEL = {
        params: req.allParams(),
        req: req,
        res: res,
        count: req.param('count') || 1,
        first_name_list: req.param('first_name') ? req.param('first_name').split(',') : '',
        first_name: req.param('first_name'),
        sql_mapper: 'test.fortest'
    };



    // 2. 필수값 체크
    chkData.chkParam(req, res, [FOR_TEST_MODEL.count, FOR_TEST_MODEL.first_name], function () {

        // 3. 쿼리 매핑
        var sqlMapper = QueryService.getSqlMapper(FOR_TEST_MODEL.sql_mapper, FOR_TEST_MODEL);
        sails.log.debug('sql ::: ' + sqlMapper.sql);
        sails.log.debug('params ::: ' + sqlMapper.parametros);

        // 4. 실행
        DB.query(sqlMapper.sql, sqlMapper.parametros, function (err, result) {
            if(err) {
                status = 500;
                return res.send( debug.wrap( req, res, status, err ) );
            }

            if(result.length<1) {
                status = 400;

                var error = ErrorHandler.NOT_FOUND_DATA;
                return res.send( debug.wrap( req, res, status, error ));
            } else {
                rtn_val.results = result;
                status = 200;
                return res.send( debug.wrap( req, res, status, rtn_val ));
            }
        });

    });
}

function _fortest_promise(req, res) {
    sails.log.debug( '================ 3. FOR 테스트 - PROMISE ================');

    // 1. 모델 정의
    var FOR_TEST_MODEL = _.extend({}, BaseModel, {
        count: req.param('count') || 1,
        first_name_list: req.param('first_name') ? req.param('first_name').split(',') : '',
        first_name: req.param('first_name'),
        sql_mapper: 'test.fortest'
    });

    Q.fcall(_taskValidateParams)    // 2. 필수값 체크
        .then(_taskQueryTest)       // 3. 쿼리 작성 및 실행
        .then(_taskAllSettled)      // 4. 완료
        .catch(_taskDefaultError);  // ** 에러처리

    function _taskValidateParams() {
        return ValidatorService.validatePromise({
            data: _.omit(FOR_TEST_MODEL, ['req','res','results']),
            validator:[
                {key:'count' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                                                  {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }},
                {key:'first_name' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                                                       {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }}
            ]
        });
    }

    function _taskQueryTest(){
        var sql_mapper = FOR_TEST_MODEL.sql_mapper;
        return TaskService
        .taskExecuteQuery(
            sql_mapper, /* test.fortest */
            FOR_TEST_MODEL
        );
    }

    function _taskAllSettled(){
        return TaskService
        .taskAllSettled(
            req,
            res,
            FOR_TEST_MODEL
        );

    }

    function _taskDefaultError(__err){
        return TaskService
        .taskDefaultError(
            req,
            res,
            __err
        );
    }
}

function _fortest_complete(req, res) {
    sails.log.debug( '================ 3. FOR 테스트 - COMPLETE ================');

    // 1. 모델 정의
    var FOR_TEST_MODEL = _.extend({}, BaseModel, {
        count: req.param('count') || 1,
        first_name_list: req.param('first_name') ? req.param('first_name').split(',') : '',
        first_name: req.param('first_name'),
        sql_mapper: 'test.fortest'
    });

    Q.fcall(
        //Q.fapply(this.prototype.taskValidateParams, [
        //    FOR_TEST_MODEL,
        //    [{key:'count' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
        //                                       {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }},
        //     {key:'first_name' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
        //                                            {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }}]])      // 2. 필수값 체크
        this.prototype.taskValidateParams(
            FOR_TEST_MODEL,
            [{key:'count' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }},
                {key:'first_name' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                        {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }}])
        )      // 2. 필수값 체크
        //.then(Q.fapply(this.prototype.taskQueryTest, [FOR_TEST_MODEL.sql_mapper, FOR_TEST_MODEL]))    // 3. 쿼리 작성 및 실행
        //.then(function() {return Q.fapply(this.prototype.taskQueryTest, [FOR_TEST_MODEL.sql_mapper, FOR_TEST_MODEL])})    // 3. 쿼리 작성 및 실행
        .then(this.prototype.taskQueryTest(FOR_TEST_MODEL.sql_mapper, FOR_TEST_MODEL))
        //.then(Q.fapply(this.prototype.taskAllSettled, [FOR_TEST_MODEL]))                    // 4. 완료
        //.then(function() {return Q.fapply(this.prototype.taskAllSettled, [FOR_TEST_MODEL])})                    // 4. 완료
        .then(this.prototype.taskAllSettled(req, res, FOR_TEST_MODEL))                    // 4. 완료
        .catch(function(err){Q.fapply(this.prototype.taskDefaultError, [req,res,err])});                         // ** 에러처리
}

function _choosetest(req, res) {
    sails.log.debug( '================ 4. CHOOSE 테스트 ================');
    var CHOOSE_TEST_MODEL = {
        params: req.allParams(),
        req: req,
        res: res,
        count: req.param('count') || 1,
        gender: req.param('gender'),
        sql_mapper: 'test.choosetest',
        result: {
            listCount: undefined,
            affectedRows: undefined,
            changedRows: undefined,
            fieldCount: undefined,
            insertId: undefined,
            protocol41: undefined,
            serverStatus: undefined,
            warningCount: undefined,
            message: undefined,
            resultmap: []
        }
    };

    Q.fcall(_taskValidateParams)    // 1. parameter 검증
        .then(_taskQueryTest)       // 2. query test
        .then(_taskAllSettled)      // 3. 완료
        .catch(_taskDefaultError);  // ** default error excute

    function _taskValidateParams() {
        return ValidatorService.validatePromise({
            data: _.omit(CHOOSE_TEST_MODEL, ['req','res','results']),
            validator:[
                {key:'count' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                                                  {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }},
                {key:'gender' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                                                   {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }}
            ]
        });
    }

    function _taskQueryTest(){
        var sql_mapper = CHOOSE_TEST_MODEL.sql_mapper;
        return TaskService
        .taskExecuteQuery(
            sql_mapper, /* test.choosetest */
            CHOOSE_TEST_MODEL
        );
    }

    function _taskAllSettled(){
        return TaskService
        .taskAllSettled(
            req,
            res,
            CHOOSE_TEST_MODEL
        );

    }

    function _taskDefaultError(__err){
        return TaskService
        .taskDefaultError(
            req,
            res,
            __err
        );
    }
}

function _wheretest(req, res) {
    sails.log.debug( '================ 5. WHERE 테스트 ================');
    var WHERE_TEST_MODEL = {
        params: req.allParams(),
        req: req,
        res: res,
        count: req.param('count') || 1,
        gender: req.param('gender'),
        first_name: req.param('first_name'),
        sql_mapper: 'test.wheretest',
        result: {
            listCount: undefined,
            affectedRows: undefined,
            changedRows: undefined,
            fieldCount: undefined,
            insertId: undefined,
            protocol41: undefined,
            serverStatus: undefined,
            warningCount: undefined,
            message: undefined,
            resultmap: []
        }
    };

    Q.fcall(_taskValidateParams)    // 1. parameter 검증
        .then(_taskQueryTest)       // 2. query test
        .then(_taskAllSettled)      // 3. 완료
        .catch(_taskDefaultError);  // ** default error excute

    function _taskValidateParams() {
        return ValidatorService.validatePromise({
            data: _.omit(WHERE_TEST_MODEL, ['req','res','results']),
            validator:[
                {key:'count' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                                                  {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }},
                {key:'gender' , validation:{ list:[{fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }},
                {key:'first_name' , validation:{ list:[{fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }}
            ]
        });
    }

    function _taskQueryTest(){
        var sql_mapper = WHERE_TEST_MODEL.sql_mapper;
        return TaskService
        .taskExecuteQuery(
            sql_mapper, /*test.wheretest*/
            WHERE_TEST_MODEL
        );
    }

    function _taskAllSettled(){
        return TaskService
        .taskAllSettled(
            req,
            res,
            WHERE_TEST_MODEL
        );

    }

    function _taskDefaultError(__err){
        return TaskService
        .taskDefaultError(
            req,
            res,
            __err
        );
    }
}

function _insertonetest(req, res) {
    sails.log.debug( '================ 6. INSERT 테스트 - 1row ================');
    var INSERT_TEST1_MODEL = {
        params: req.allParams(),
        req: req,
        res: res,
        birth_date: req.param('birth_date'),
        first_name: req.param('first_name'),
        last_name: req.param('last_name'),
        gender: req.param('gender'),
        hire_date: req.param('hire_date'),
        sql_mapper: 'test.insertonetest',
        result: {
            listCount: undefined,
            affectedRows: undefined,
            changedRows: undefined,
            fieldCount: undefined,
            insertId: undefined,
            protocol41: undefined,
            serverStatus: undefined,
            warningCount: undefined,
            message: undefined,
            resultmap: []
        }
    };

    Q.fcall(_taskValidateParams)    // 1. parameter 검증
        .then(_taskQueryTest)       // 2. query test
        .then(_taskAllSettled)      // 3. 완료
        .catch(_taskDefaultError);  // ** default error excute

    function _taskValidateParams() {
        return ValidatorService.validatePromise({
            data: _.omit(INSERT_TEST1_MODEL, ['req','res','results']),
            validator:[
                {key:'birth_date' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                                                       {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }},
                {key:'first_name' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                                                       {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }},
                {key:'last_name' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                                                      {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }},
                {key:'gender' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                                                   {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }},
                {key:'hire_date' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                                                      {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }}
            ]
        });
    }

    function _taskQueryTest(){
        var sql_mapper = INSERT_TEST1_MODEL.sql_mapper;
        return TaskService
        .taskExecuteQuery(
            sql_mapper, /*test.insertonetest*/
            INSERT_TEST1_MODEL
        );
    }

    function _taskAllSettled(){
        return TaskService
        .taskAllSettled(
            req,
            res,
            INSERT_TEST1_MODEL
        );

    }

    function _taskDefaultError(__err){
        return TaskService
        .taskDefaultError(
            req,
            res,
            __err
        );
    }
}

function _insertmanytest(req, res) {
    sails.log.debug( '================ 7. INSERT 테스트 - many rows ================');

    var emp = {
        birth_date : req.param('birth_date') || "",
        first_name : req.param('first_name') || "",
        last_name : req.param('last_name') || "",
        gender : req.param('gender') || "",
        hire_date : req.param('hire_date') || ""
    };

    var INSERT_TEST2_MODEL = {
        params: req.allParams(),
        req: req,
        res: res,
        emp_arr: [emp, emp],
        sql_mapper: 'test.insertmanytest',
        result: {
            listCount: undefined,
            affectedRows: undefined,
            changedRows: undefined,
            fieldCount: undefined,
            insertId: undefined,
            protocol41: undefined,
            serverStatus: undefined,
            warningCount: undefined,
            message: undefined,
            resultmap: []
        }
    };

    Q.fcall(_taskValidateParams)    // 1. parameter 검증
        .then(_taskQueryTest)       // 2. query test
        .then(_taskAllSettled)      // 3. 완료
        .catch(_taskDefaultError);  // ** default error excute

    function _taskValidateParams() {
        return ValidatorService.validatePromise({
            data: _.omit(INSERT_TEST2_MODEL, ['req','res','results']),
            validator:[
                {key:'emp_arr' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                                                       {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }}
            ]
        });
    }

    function _taskQueryTest(){
        var sql_mapper = INSERT_TEST2_MODEL.sql_mapper;
        return TaskService
        .taskExecuteQuery(
            sql_mapper, /*test.insertmanytest*/
            INSERT_TEST2_MODEL
        );
    }

    function _taskAllSettled(){
        return TaskService
        .taskAllSettled(
            req,
            res,
            INSERT_TEST2_MODEL
        );

    }

    function _taskDefaultError(__err){
        return TaskService
        .taskDefaultError(
            req,
            res,
            __err
        );
    }
}

function _replacemanytest(req, res) {
    sails.log.debug( '================ 8. REPLACE 테스트 - many rows ================');

    var emp = {
        birth_date : req.param('birth_date') || "",
        first_name : req.param('first_name') || "",
        last_name : req.param('last_name') || "",
        gender : req.param('gender') || "",
        hire_date : req.param('hire_date') || ""
    };

    var REPLACE_TEST_MODEL = {
        params: req.allParams(),
        req: req,
        res: res,
        emp_arr: [emp, emp],
        sql_mapper: 'test.replacemanytest',
        result: {
            listCount: undefined,
            affectedRows: undefined,
            changedRows: undefined,
            fieldCount: undefined,
            insertId: undefined,
            protocol41: undefined,
            serverStatus: undefined,
            warningCount: undefined,
            message: undefined,
            resultmap: []
        }
    };

    Q.fcall(_taskValidateParams)    // 1. parameter 검증
        .then(_taskQueryTest)       // 2. query test
        .then(_taskAllSettled)      // 3. 완료
        .catch(_taskDefaultError);  // ** default error excute

    function _taskValidateParams() {
        return ValidatorService.validatePromise({
            data: _.omit(REPLACE_TEST_MODEL, ['req','res','results']),
            validator:[
                {key:'emp_arr' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                                                    {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }}
            ]
        });
    }

    function _taskQueryTest(){
        var sql_mapper = REPLACE_TEST_MODEL.sql_mapper;
        return TaskService
        .taskExecuteQuery(
            sql_mapper, /*test.replacemanytest*/
            REPLACE_TEST_MODEL
        );
    }

    function _taskAllSettled(){
        return TaskService
        .taskAllSettled(
            req,
            res,
            REPLACE_TEST_MODEL
        );

    }

    function _taskDefaultError(__err){
        return TaskService
        .taskDefaultError(
            req,
            res,
            __err
        );
    }
}

function _updatetest(req, res) {
    sails.log.debug( '================ 9. UPDATE 테스트 ================');

    var UPDATE_TEST_MODEL = {
        params: req.allParams(),
        req: req,
        res: res,
        emp_no: req.param('emp_no'),
        birth_date: req.param('birth_date'),
        first_name: req.param('first_name'),
        last_name: req.param('last_name'),
        gender: req.param('gender'),
        hire_date: req.param('hire_date'),
        sql_mapper: 'test.updatetest',
        result: {
            listCount: undefined,
            affectedRows: undefined,
            changedRows: undefined,
            fieldCount: undefined,
            insertId: undefined,
            protocol41: undefined,
            serverStatus: undefined,
            warningCount: undefined,
            message: undefined,
            resultmap: []
        }
    };

    Q.fcall(_taskValidateParams)    // 1. parameter 검증
        .then(_taskQueryTest)       // 2. query test
        .then(_taskAllSettled)      // 3. 완료
        .catch(_taskDefaultError);  // ** default error excute

    function _taskValidateParams() {
        return ValidatorService.validatePromise({
            data: _.omit(UPDATE_TEST_MODEL, ['req','res','results']),
            validator:[
                {key:'emp_no' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                                                   {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }},
                {key:'birth_date' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                                                       {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }},
                {key:'hire_date' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                                                      {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }}
            ]
        });
    }

    function _taskQueryTest(){
        var sql_mapper = UPDATE_TEST_MODEL.sql_mapper;
        return TaskService
        .taskExecuteQuery(
            sql_mapper, /*test.updatetest*/
            UPDATE_TEST_MODEL
        );
    }

    function _taskAllSettled(){
        return TaskService
        .taskAllSettled(
            req,
            res,
            UPDATE_TEST_MODEL
        );

    }

    function _taskDefaultError(__err){
        return TaskService
        .taskDefaultError(
            req,
            res,
            __err
        );
    }
}

function _updatesettest(req, res) {
    sails.log.debug( '================ 10. UPDATE SET 테스트 ================');

    var UPDATESET_TEST_MODEL = {
        params: req.allParams(),
        req: req,
        res: res,
        emp_no: req.param('emp_no'),
        birth_date: req.param('birth_date'),
        first_name: req.param('first_name'),
        last_name: req.param('last_name'),
        gender: req.param('gender'),
        hire_date: req.param('hire_date'),
        sql_mapper: 'test.updatesettest',
        result: {
            listCount: undefined,
            affectedRows: undefined,
            changedRows: undefined,
            fieldCount: undefined,
            insertId: undefined,
            protocol41: undefined,
            serverStatus: undefined,
            warningCount: undefined,
            message: undefined,
            resultmap: []
        }
    };

    Q.fcall(_taskValidateParams)    // 1. parameter 검증
        .then(_taskQueryTest)       // 2. query test
        .then(_taskAllSettled)      // 3. 완료
        .catch(_taskDefaultError);  // ** default error excute

    function _taskValidateParams() {
        return ValidatorService.validatePromise({
            data: _.omit(UPDATESET_TEST_MODEL, ['req','res','results']),
            validator:[
                {key:'emp_no' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                    {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }},
                {key:'birth_date' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                    {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }},
                {key:'hire_date' , validation:{ list:[{fnc:is.not.undefined, code:'ER_UNDEFINED_PARAM_ERROR'},
                    {fnc:is.not.empty, code:'ER_EMPTY_PARAM_ERROR'}] }}
            ]
        });
    }

    function _taskQueryTest(){
        var sql_mapper = UPDATESET_TEST_MODEL.sql_mapper;
        return TaskService
        .taskExecuteQuery(
            sql_mapper, /*test.updatesettest*/
        UPDATESET_TEST_MODEL
        );
    }

    function _taskAllSettled(){
        return TaskService
        .taskAllSettled(
            req,
            res,
            UPDATESET_TEST_MODEL
        );

    }

    function _taskDefaultError(__err){
        return TaskService
        .taskDefaultError(
            req,
            res,
            __err
        );
    }
}

