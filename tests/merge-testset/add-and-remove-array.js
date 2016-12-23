module.exports = function(base, ops){
    return {
        a : ops.list(base.a, {remove: ["a"], add : ["b"]})
    }
}