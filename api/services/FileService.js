/*
var crypto = require('crypto');
var fs = require('fs');
var Q = require('q');
var SFTPClient = require('ssh2').Client;

var SFTP_INFO = {
  host: sails.config.ftp.host,
  port: sails.config.ftp.port,
  username: sails.config.ftp.username,
  password: sails.config.ftp.password,
  cwd: sails.config.ftp.cwd,
  upload_dir:'/DAT'
};

module.exports = {
  computeFileHash : _computeFileHash,
  computeFileHashPromisify:_computeFileHashPromisify,
  connectSFTP:_connectSFTP,
  destroyConnectSFTP:_destroyConnectSFTP,
  createDir:_createDir,
  createFileStream:_createFileStream,
  uploadThreedFiles:_uploadThreedFiles
};


function _computeFileHash(source, callback) {
  var hash;
  var fd;

  hash = crypto.createHash('sha256');
  hash.setEncoding('hex');

  fd = fs.createReadStream(source);
  fd.on('error', function (err) {
    return callback(err, null);
  });
  fd.on('end', function () {
    hash.end();
    var checksum = hash.read();
    return callback(null, checksum);
  });
  fd.pipe(hash);
}

function _computeFileHashPromisify(source){
  var deferred = Q.defer();
  var hash;
  var fd;

  hash = crypto.createHash('sha256');
  hash.setEncoding('hex');

  fd = fs.createReadStream(source);
  fd.on('error', function (err) {
    deferred.reject(err);
  });
  fd.on('end', function () {
    hash.end();
    deferred.resolve({source:source ,hash:hash.read()});
  });
  fd.pipe(hash);

  return deferred.promise;
}

function _connectSFTP(conn_info, destroy_fnc){
  var deferred = Q.defer();

  var conn = new SFTPClient();
  var sftp;

  conn.on('ready', function(){
    conn.sftp(function(err, ftp) {
      if (err) {
        console.log('err SFTP_CONNECTION sftp: ' , err);
        destroy_fnc(conn, sftp);
        deferred.reject(err);
        return false;
      }
      sftp = ftp;
      deferred.resolve({connection:conn, sftp:ftp});
    });
  });

  conn.on('error', function(err){
    if (err) {
      console.log('err SFTP_CONNECTION : ' , err);
      destroy_fnc(conn, sftp);
      deferred.reject(err);
    }
  });

  conn.on('end', function(){
    console.log('end conn : ' );
    destroy_fnc(conn, sftp);
  });

  conn.connect(conn_info);

  return deferred.promise;
}

function _destroyConnectSFTP(c, f){
  try{
    if(f) f.end();
    if(c){
      c.end();
      c.destroy();
    }
    c = null;
    f = null;
  }catch(e){

  }
}

function _createDir(conn, sftp, dir){
  var d = Q.defer();
  try{
    sftp.mkdir(dir, function(err){
      if(err){
        //throw err;
        console.log('fail, _createDir: ' , err);
        d.reject(err);

      }else{
        console.log('success, _createDir');
        d.resolve({connection:conn, sftp:sftp, dir:dir});
      }

    });

  }catch(e){
    d.reject(e);
  }

  return d.promise;
}

function _createFileStream(conn, sftp, readFilePath, uploadPath){
  var d = Q.defer();
  try{
    //TODO: readStream, writeStream ==>destroy
    var readStream = fs.createReadStream( readFilePath );
    var writeStream = sftp.createWriteStream( uploadPath );

    writeStream.once('close',function () {
      console.log( "- file transferred succesfully" );
      writeStream.end();
      readStream = null;
      writeStream = null;
      d.resolve({code:'SUCCESS', connection:conn, sftp:sftp, readFilePath:readFilePath ,uploadPath:uploadPath });
    });

    writeStream.once('end', function () {
      console.log( "sftp connection closed" );
    });
    readStream.once('error', function (err) {
      if(err){
        //throw err;
        try{
          readStream = null;
          writeStream = null;
        }catch(e){}
        d.reject(err);
      }
    });
    readStream.pipe( writeStream );

  }catch(e){
    d.reject(e);
  }

  return d.promise;
}

function _uploadThreedFiles(source){
  sails.log.debug('uploadThreedFiles: ',source.td_cd);

  var deferred = Q.defer();
  var mkdir_path = '/'+SFTP_INFO.cwd+SFTP_INFO.upload_dir+'/'+(source.td_cd);
  var td_ctx = {};

  Q.fcall(_connectSFTPServer)
    .then(_assignConnAndSFTP)
    .then(_createDirectory)
    .then(_uploadTdFiles)
    .spread(_allSetttled)
    .catch(function(e){
      console.log('fail::: FileServices.uploadThreedFiles: ' , e);
      _destroyConnectSFTP( td_ctx.connection, td_ctx.sftp );
      deferred.reject(e);
    });


  function _connectSFTPServer(){
    return _connectSFTP(SFTP_INFO, _destroyConnectSFTP);
  }

  function _assignConnAndSFTP(results){
    //예외처리때 destroy하기위한  connect, sftp instance의 mutable state
    td_ctx = results;
    return Q.all([results]);
  }

  function _createDirectory(results){
    console.log('_createDirectory: ');
    return _createDir(results[0].connection, results[0].sftp, mkdir_path);
  }

  function _uploadTdFiles(results){
    var uploadFilePromises = [];
    for(var i=0, iTotal = source.upload_req_list.length; i<iTotal; ++i){
      uploadFilePromises.push(_createFileStream(
        results.connection,
        results.sftp,
        source.upload_req_list[i],
        mkdir_path+'/'+source.upload_req_file[i]
      ));
    }
    return Q.all(uploadFilePromises);
  }

  function _allSetttled(){
    console.log('uploadThreedFiles _allSetttled: ' );
    _destroyConnectSFTP( td_ctx.connection, td_ctx.sftp );
    td_ctx = null;
    deferred.resolve(source);
  }


  return deferred.promise;
}
*/
