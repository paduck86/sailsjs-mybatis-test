/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

var lib_env = require("../libs/env.js"),
  env = lib_env.get(),
  tmpPort = (process.env.PORT===undefined) ? (env.DOMAIN_PORT)?env.DOMAIN_PORT:1337 : parseInt(process.env.PORT,10);


module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/
  // models: {
  //   connection: 'someMongodbServer'
  // }
  maxage: 60,


  aws: {
    s3: {
        config: {
          accessKeyId: env.AWS_S3_KEY,
          secretAccessKey: env.AWS_S3_SECRET,
          region: env.AWS_S3_REGION
        },
        bucket: env.AWS_S3_BUCKET,
        url: env.AWS_S3_DOMAIN
    }
  },

  sqlmapper: {
    dir: env.SQL_MAPPER_DIR
  },

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/
  log: {
    level: "info"
  }
};
