var is = require('is_js'),
  Q = require('q'),
  _ = require('underscore');


/*
 var params = CommonService.getQueryPath(
 {
 admin_uuid:req.session.account_uuid,
 account_uuid:(req.param('account_uuid') || req.session.account_uuid),
 show:'debug'
 },
 '?'
 ),
 tmpValidator = [
 {key:'admin_uuid' , validation:{ list:[{fnc:is.not.empty, code:'EMPTY_ADMIN_UUID'}] }},
 {key:'account_uuid' , validation:{ list:[{fnc:is.not.empty, code:'EMPTY_ACCOUNT_UUID'}] }}
 ];

 var isFakeServer = false,
 apiURL = RequestService.getAPIUrl(isFakeServer),
 apiPath = RequestService.getAPIPath(RequestService.API_URL.GET_AUTH, isFakeServer)+params,
 apiPort = RequestService.getAPIPort(isFakeServer);

 ValidatorService
 .validatePromise({data:params, validator:tmpValidator})
 .then(


 */

var _globalLangArr = ['ko','en','zh','cn','tw','jp','zh-cn','zh-tw'],
  _globalCurrencyArr =['KRW','USD','EUR','CNY','HKD','TWD','JPY','INR','AED','SAR'];

module.exports = {
  validate:_validate,
  validatePromise:_validatePromise,
  orgValidator:OrgValidator()
};

function _validate(__opt){

  if(is.not.existy(__opt.data)){
    return {isValid:false, code:'NO_DATA', status:400};
  }

  if(is.existy(__opt.validator) && is.array(__opt.validator) && __opt.validator.length>0){
    var chk = true, code='', key='', status='', iLen = __opt.validator.length, jLen;
    for( var i=0; i<iLen; ++i ){
      chk = true;
      if(is.existy(__opt.validator[i].validation) && is.existy(__opt.validator[i].validation.list) ){
        jLen = __opt.validator[i].validation.list.length;
        for( var j=0; j<jLen; ++j ){
          if(__opt.validator[i].validation.list[j].fnc(__opt.data[__opt.validator[i].key])===true){
          }else{
            chk= false;
            code = __opt.validator[i].validation.list[j].code;
            status = (__opt.validator[i].validation.list[j].status || 400);
            key = __opt.validator[i].key;
            break;
          }
        }
      }
      if(!chk) {
        break;
      }
    }
    if(chk){
      return {isValid:true, data:__opt.data};

    }else{
      return {isValid:false, code:code, key:key, status:status};
    }

  }else{
    return {isValid:true, data:__opt.data}
  }

}

function _validatePromise(__opt){
  sails.log.debug('_validatePromise :::: ' );
  var deferred = Q.defer(),
    rel = _validate(__opt);

  if( rel.isValid ){
    deferred.resolve(rel);
  }else{
    sails.log.debug('_validatePromise rel: ' , rel);
    deferred.reject(rel);
  }
  return deferred.promise;
}

function _chkEmptyOnPromise(__opt){
  var tmpValidator = [];
  if(__opt.data){
    for(var i in __opt.data){
      tmpValidator.push({key:i , validation:{ list:[{fnc:is.not.empty, code:'EMPTY_'+String(i).toUpperCase()}] }});
    }
  }
  return _validatePromise({data:__opt.data, validator:tmpValidator});
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Validation Util Method

function OrgValidator(){
  return {
    validateZeroOrOne:_validateZeroOrOne,
    validateLanguage:_validateCompareArr(_globalLangArr),
    validateCurrency:_validateCompareArr(_globalCurrencyArr),
    validateServiceCode:_validateServiceCode,
    validatePassword: _validatePassword
  };

  function _validateZeroOrOne(__ipt){
    if(__ipt===0 || __ipt===1 || __ipt==='0' || __ipt==='1'){
      return true;
    }else{
      return false;
    }
  }

  function _validateCompareArr(__langArr){
    return function(__ipt){
      var ipt = __ipt.toLowerCase();

      return _.some( __langArr, function( el ) {
        return el.toLowerCase() === ipt;
      } );
    }
  }

  function _validateServiceCode(__str) {
    var result = true,
      __dup = [],
      __arr = __str.toString().split(',');
    __arr.forEach(function (val) {
      if (!result) return;
      result = (__dup.indexOf(val) !== -1) ? false : (val.match(/[0|1|2]/) === null) ? false : true;
      __dup.push(val);
    });
    return result;
  }

  function _validatePassword(__str){
    return __str.match(/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{10,16}$|^(?=.*\d)(?=.*\W).{10,16}$/) !== null
  }

}
