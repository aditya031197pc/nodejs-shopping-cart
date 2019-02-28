const fs = require('fs');

exports.deleteFile = (filepath) =>{
    // note that the filepath right now has a / in the begining, which will cause errors so remove the /:
    filepath = filepath.substring(1);
    fs.unlink(filepath, err => {
        if(err) {
            throw err;
        }
    })
};
