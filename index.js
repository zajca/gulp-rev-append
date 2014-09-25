var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var Buffer = require('buffer').Buffer;
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var map = require('event-stream').map;

var FILE_DECL = /[\?]rev=(.*)[\"]/gi;

function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex')
        .slice(0,len);
}

var revPlugin = function revPlugin() {

  return map(function(file, cb) {

    var contents = file.contents.toString();
    var lines = contents.split('\n');
    var i, length = lines.length;
    var line;
    var groups;
    var hash;

    if(!file) {
      throw new PluginError('gulp-rev', 'Missing fileName option for gulp-rev.');
    }
    hash = randomValueHex(5)

    for(i = 0; i < length; i++) {
      line = lines[i];
      groups = FILE_DECL.exec(line);
      if(groups && groups.length > 1) {
        try {
            line = line.replace(groups[1], hash);
        }
        catch(e) {
          // fail silently.
            console.log("gulp-rev failed",e);
        }
      }
      lines[i] = line;
      FILE_DECL.lastIndex = 0;
    }
    //console.log(lines)
    file.contents = new Buffer(lines.join('\n'));
    cb(null, file);

  });

};

module.exports = revPlugin;
