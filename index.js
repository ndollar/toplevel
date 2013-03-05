var fs = require('fs'),
    path = require('path');

var cache = {};

var toplevel = module.exports = function(fileName) {
  return function toplevel(moduleId, callback) {
    var topLevelDir = getTopLevel(fileName);
    var modulePath = path.join(topLevelDir, moduleId);
    callback = callback || require;
    return callback(modulePath);
  }
}

var getTopLevel = module.exports.getTopLevel  = function getTopLevel(dirName) {
  var cached = cache[dirName];
  if ( cached ) { return cached; }

  var directories = dirName.split(path.sep);

  var path_, files;
  for ( var i = 0, len = directories.length; i < len - 1; i++) {
    path_ = getPath( directories, len - i);
    try {
      files = fs.readdirSync(path_);
    } catch (error) {
      if ( error.code === 'ENOTDIR' && i === 0 ) {
          // If the full path isnt a directory then
          // the user probably passed in 
          // a file path instead of a
          // directory path. Try to continue 
          // up the tree.
          continue;
      } else { throw error; }
    }

    for ( var k = 0, length = files.length; k < length; k++ ) {
      if ( files[k].toLowerCase() === 'top' ) { 
        cache[dirName] = path_;
	return path_;
      } 
    }  
  }
}

var getPath = function getPath(directories, index) {
  var newPath = [];
  for ( var j = 0; j < index; j++ ) {
    newPath.push(directories[j]); 
  }
  return newPath.join(path.sep); 
}
