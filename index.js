var _ = require('lodash')
var async = require('async')
var npm = require('npm')

function RequireVersion(module, version, next) {
    return installVersion.apply(null, arguments)
}

RequireVersion.restore = function(module, next)  {
    return installVersion(module, next)
}

RequireVersion.run = function(module, versions, fn, done)  {
    async.eachSeries(versions, function iterator(version, cb) {
        RequireVersion(module, version, function(err) {
            if (err) done(err)
            fn(require(module), version, cb)
        })
    }, done)
}

RequireVersion.runLast = function(module, numberOfVersions, fn, done)  {
    if (!typeof numberOfVersions === 'number') return done(new Error("A number must be provided for the version limit"))
    RequireVersion.list(module, function(err, versions) {
        if (err) return done(err)
        RequireVersion.run(module, _.take(versions, numberOfVersions), fn, done)
    })
}

RequireVersion.runAll = function(module, fn, done)  {
    RequireVersion.list(module, function(err, versions) {
        if (err) return done(err)
        RequireVersion.run(module, versions, fn, done)
    })
}

RequireVersion.list = function(module, next)  {
    var silent = true
    npm.load({ loaded: false }, function (err) {
        if (err) return next(err)
        npm.commands.view([ module, 'versions' ], silent, function(err, info) {
            if (err) return next(err)
            var versions = (info[_.first(_.keys(info))].versions).reverse()
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