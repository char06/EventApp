//This is a function that accepts a function and catches errors. 
module.exports = func => {
    return(req, res, next) => {
        func(req, res, next).catch(next)
    }
}