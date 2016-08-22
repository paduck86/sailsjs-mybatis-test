var Q = require('q');

module.exports = {
    invokePromise: _invokePromise,
    taskSideEffect: _taskSideEffect,
    taskMapData: _taskMapData
};

function _invokePromise(fnc, valFnc){
    return function(results){
        return Q.fapply(fnc, valFnc(results) );
    }
}

function _taskSideEffect(func){
    return function(){
        if(func) func(arguments);
        return arguments;
    };
}

function _taskMapData(mapData){
    return function(){
        if(mapData){
            if(typeof mapData==='function'){
                return mapData(arguments);
            }else{
                return mapData
            }
        }else{
            return arguments;
        }
    };
}
