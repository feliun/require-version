var async = require('async')
var requireVersion = require('./index')

var myModule = 'worksmith'

async.series([
    function(cb) {
        requireVersion(myModule, '0.2.7', function(err) {
            if (err) return cb(err)
            console.log('The module has been installed')
            cb()
        })
    },
    function(cb) {
        requireVersion.list(myModule, function(err, versions) {
            if (err) return cb(err)
            console.log('These are all the versions for ', myModule, versions)
            cb()
        })
    },
    function(cb) {
        var numVersions = 2
        requireVersion.runLast(myModule, numVersions, function(module, version, next) {
            console.log('Executing logic for module ', myModule, ' and version ', version)
            next()
        }, function(err) {
            if (err) return cb(err)
            console.log('The last ' + numVersions + ' versions were run')
            cb()
        })
    },
    function(cb) {
        requireVersion.run(myModule, [ '0.2.7', '0.0.14' ], function(module, version, next) {
            console.log('Executing logic for module ', myModule, ' and version ', version)
            next()
        }, function(err) {
            if (err) return cb(err)
            console.log('The selected versions were run')
            cb()
        })
    },
    function(cb) {
        requireVersion.restore(myModule, function(err) {
            if (err) return cb(err)
            console.log('The original version has been restored')
            cb()
        })
    },
    function(cb) {
        requireVersion.runAll(myModule, function(module, version, next) {
            console.log('Executing logic for module ', myModule, ' and version ', version)
            next()
        }, function(err) {
            if (err) return cb(err)
            console.log('All the existent versions were run')
            cb()
        })
    }
], function(err) {
    if (err) return console.error(err)
    console.log('All operations were run')
})