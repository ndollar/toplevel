### Toplevel

Toplevel is a super simple node module that wraps the built-in require() and lets you require your code relative to a top level directory rather than relative to the current file.

#### How it works

Create an empty _Top_ file in the top level directory of your code.

```shell
$ touch Toplevel
$ tree -I node_modules .
.
├── app.js
├── lib
│   └── example.js
├── package.json
├── test
│   └── example_test.js
└── Top
```

Now any code in subdirectories like _lib_ or _test_ can use topl to require modules relative to the Top file.

test/example_tests.js:
```javascript
var requireFromTop = require('toplevel')(__dirname)
   ,example = requireFromTop('lib/example');
...
```

