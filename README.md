# require-version
Require dynamically a npm module with a particular version

## How can this module help me?
This module is useful for several reasons:

- Stress tests: Run stress tests against different versions of your own module to analyse if your changes are altering the performance of your code
- Regression tests: Run regression tests in different versions of your module to verify whether your new changes will be backwards compatible or otherwise will break previous versions
- Bug fixing: If you are suspicious of a third-party module being buggy, run your code against its different versions to try to find a healthy one which works with your code (and then raise an issue!)

## How can I use it?
This module provides you with a set of methods to require different versions in a quite flexible way:

First of all, require the **require-version** module in your project:

```var requireVersion = require('require-version')```

After that, you can use the following available methods:

### list

```
requireVersion.list(myModule, function(err, versions) {
      if (err) //handle your error here
      console.log('These are all available versions for ', myModule, versions)
  })
```

### run

```
requireVersion.run(myModule, [ '0.2.7', '0.0.14' ], function(module, version, next) {
    console.log('Executing logic for module ', myModule, ' and version ', version)
    next()
}, function(err) {
    if (err) //handle your error here
    console.log('The specified versions were run')
})
```

### runLast

It runs all last versions to a limit specified as parameter

```
requireVersion.runLast(myModule, numVersions, function(module, version, next) {
    console.log('Executing logic for module ', myModule, ' and version ', version)
    next()
}, function(err) {
    if (err) //handle your error here
    console.log('The last ' + numVersions + ' versions were run')
  })
```

### runAll

```
requireVersion.runAll(myModule, function(module, version, next) {
    console.log('Executing logic for module ', myModule, ' and version ', version)
    next()
}, function(err) {
    if (err) //handle your error here
    console.log('All the existent versions were run')
})
```

### restore

```
requireVersion.restore(myModule, function(err) {
    if (err) //handle your error here
    console.log('The original version has been restored')
})
```

## Can I see a real example?

Sure thing. You can find a working example using all these methods [here](https://github.com/feliun/require-version/blob/master/sample.js)
