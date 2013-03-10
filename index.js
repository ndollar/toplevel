var fs = require('fs'),
    path = require('path');

var cache = {};

var toplevel = module.exports = function(dirName) {
  var topl = function toplevel(moduleId, callback) {
    var topLevelDir = getTopLevel(dirName);
    var modulePath = path.join(topLevelDir, moduleId);
    callback = callback || require;
    return callback(modulePath);
  }
  // Fail fast. Calling getTopLevel will throw
  // an exception if the Top file isnt 
  // found.
  getTopLevel(dirName);
  return topl;
}

var getTopLevel = module.exports.getTopLevel  = function getTopLevel(dirName) {
  // In case a relative path is given.
  dirName = path.resolve(dirName);
  if (!fs.existsSync(dirName)) {
    throw new Error("File or directory '" + dirName + "' does not exist.");
  }

  var directories = dirName.split(path.sep)
    , i = directories.length
    , stats = fs.lstatSync(dirName);

  // If the full path isnt a directory then
  // the user probably passed in 
  // a file path instead of a
  // directory path. Start at the parent
  // instead.
  if ( !stats.isDirectory() ) {
    i = i - 1; 
    dirName = getPath(directories, i);
  }

  var cached = cache[dirName];
  if ( cached ) { return cached; }
 
  var  files
     , searchedIn = []
     , path_;

  for (; i > 1; i--) {
    path_ = getPath( directories, i);
    files = fs.readdirSync(path_);
    for ( var k = 0, length = files.length; k < length; k++ ) {
      // If the 'file' is a directory, skip it.
      stats = fs.lstatSync(path.join(path_, files[k]));
      if ( stats.isDirectory() ) {
        continue;
      }

      if ( files[k].toLowerCase() === 'top' ) { 
        cache[dirName] = path_;
	return path_;
      } 
    }  
    searchedIn.push(path_);
  }
  // At this point a Top file hasnt
  // been found in the directory tree
  var msg = "Top file not found. Searched in:\n"
  searchedIn.map(function(p) { msg += "  " + p + "\n"; } );
  throw new Error(msg);
}

var getPath = function getPath(directories, index) {
  var newPath = [];
  for ( var j = 0; j < index; j++ ) {
    newPath.push(directories[j]); 
  }
  return newPath.join(path.sep); 
}
