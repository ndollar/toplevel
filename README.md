## Toplevel

Toplevel is a simple node module that wraps node's built-in `require()` function and lets you require your code relative to your top level directory rather than relative to the current file.

From [node modules](http://nodejs.org/api/modules.html#modules_file_modules):

>A module prefixed with '/' is an absolute path to the file. For example, require('/home/marco/foo.js') will load the file at /home/marco/foo.js.
>
>A module prefixed with './' is relative to the file calling require(). That is, circle.js must be in the same directory as foo.js for require('./circle') to find it.
>
>Without a leading '/' or './' to indicate a file, the module is either a "core module" or is loaded from a node_modules folder."

Toplevel hopes to make it easier to require files by reducing the amount you need to know about the project structure.

### How it works

The Toplevel module exports a function that takes a single parameter. The parameter is the path that Toplevel will start with to search for the Top file. It starts by looking in the directory for the given path and continues searching up the directory tree until either a Top file is found or there are no more directories.  An `Error` is thrown if a Top file is never found.

```shell
$ pwd
/path/to/toplevel
$ touch Top
$ tree -I node_modules .
.
├── lib
│   └── example.js
├── test
│   └── example_test.js
└── Top
```

Now, any code in subdirectories like _lib_ or _test_ can use Toplevel to require modules relative to the _Top_ file. Toplevel turns paths like `../lib/example` into `/path/to/toplevel/lib/example`. 

#### Before

test/example_tests.js:
```javascript
var example = require('../lib/example');
...
```

#### After

test/example_tests.js:
```javascript
var requireFromTop = require('toplevel')(__dirname)
  , example = requireFromTop('lib/example');
...
```

In the example above, Toplevel will first search _/path/to/toplevel/test_ then _/path/to/toplevel_ where it finds the _Top_ file. 

The call to `requireFromTop('lib/example')` turns into `require('path/to/toplevel/lib/example')`.

### Installing and Using Toplevel

Install Toplevel.

```shell
$ npm install toplevel
```

Create an empty _Top_ file in the top level directory of your code.

```shell
$ touch Top
```

### Which Top file is being used?

When using Toplevel you'll often want to know which Top file is being used by Toplevel. Toplevel comes with a utility script called `which-top` that simply runs the Toplevel search function and tells you which Top level directory it finds. 

`which-top` takes a path as an optional argument. If the path argument isn't supplied it will use the current working directory.

Note: to use the unqualified `which-top` as we do below, you will need to install Toplevel globally.

```shell
$ which-top /path/to/toplevel/subdir
/path/to/toplevel
$ cd /path/to/toplevel/subdir
$ which-top
/path/to/toplevel
```
