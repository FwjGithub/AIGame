module.exports = function(status, msg, data){
    console.log("format", data)
    return JSON.stringify({
        status,
        msg,
        data
    });
}