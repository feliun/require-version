var async = require('async')
var requireVersion = require('./index')

var myModule = 'worksmith'

requireVersion.execute(myModule, 3, function(module, version, done) {
    console.log('Executing logic for module ', module, ' and version ', version)
    done()
}, function(err) {
    if (err) console.log('Error: ', err)
    requireVersion.restore(myModule, function(err) {
        if (err) console.log('Error: ', err)
        console.log('END')
    })
})