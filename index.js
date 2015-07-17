var _ = require('lodash')
var async = require('async')
var npm = require('npm')

function RequireVersion(module, version, next) {
    return installVersion.apply(null, arguments)
}

RequireVersion.restore = function(module, next)  {
    return installVersion(module, next)
}

RequireVersion.execute = function(module, numberOfVersions, fn, done)  {
    RequireVersion.list(module, 3, function(err, versions) {
        async.eachSeries(versions, function iterator(version, cb) {
            var versionedModule = RequireVersion(module, version, function(err) {
                if (err) cb(err)
                fn(module, version, cb)
            })
        }, done)
    })
}

RequireVersion.list = function(module, limit, next)  {
    if (arguments.length === 2) return RequireVersion.list(arguments[0], undefined, arguments[1])
    var silent = true
    npm.load({ loaded: false }, function (err) {
        if (err) return next(err)
        npm.commands.view([ module, 'versions' ], silent, function(err, info) {
            if (err) return next(err)
            var versions = (info[_.first(_.keys(info))].versions).reverse()
            if (limit && typeof limit === 'number') versions = _.take(versions, limit)
            next(null, versions)
        })
    })
}

function installVersion(module, version, next) {
    if (arguments.length === 2) return installVersion(arguments[0], undefined, arguments[1])
    npm.load({ loaded: false }, function (err) {
        if (err) return next(err)
        async.series([
            npm.commands.uninstall.bind(null, [ module ]),
            npm.commands.install.bind(null, version ? [ module + '@' + version ] : [ module ]),
        ], next)
    })
}

module.exports = RequireVersion