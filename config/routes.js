/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */
var BaseModel = require('../api/controllers/libs/BaseModel');
module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/
  '*' : function(req, res, next) {
    BaseModel.params = req.allParams();
    BaseModel.req = req;
    BaseModel.res = res;
    next();
  },

  '/item/list': {
    controller: 'item',
    action: 'list'
  },

/* Mybatis 테스트 */
  '/test/if1': {
    controller: 'test',
    action: 'iftest1'
  },

  '/test/if2': {
    controller: 'test',
    action: 'iftest2'
  },

  '/test/for': {
    controller: 'test',
    action: 'fortest'
  },

  '/test/choose': {
    controller: 'test',
    action: 'choosetest'
  },

  '/test/where': {
    controller: 'test',
    action: 'wheretest'
  },

  '/test/insertone': {
    controller: 'test',
    action: 'insertonetest'
  },

  '/test/insertmany': {
    controller: 'test',
    action: 'insertmanytest'
  },

  '/test/replacemany': {
    controller: 'test',
    action: 'replacemanytest'
  },

  '/test/update': {
    controller: 'test',
    action: 'updatetest'
  },

  '/test/updateset': {
    controller: 'test',
    action: 'updatesettest'
  }
};
