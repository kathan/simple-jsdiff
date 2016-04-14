# simple-jsdiff
A simple diff algorithm for finding the difference between two Javascript objects

```javascript
var a = {'my_array':[1,2,3,{'name':'mike'},{'name':'sam'},4]},
    b = {'my_array':[0,1,2,{'name':'mike'},{'name':'dave'},3]},
    Diff = require('../simple-jsdiff.js'),
    diff = Diff(a, b);
console.log(diff);
```
