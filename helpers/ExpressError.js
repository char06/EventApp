//Creating this function to handle possible errors in express
class ExpressError extends Error {
    constructor(message, statusCode) {
        super(); 
        this.message = message; 
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError; 