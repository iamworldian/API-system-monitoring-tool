// Dependencies
const fs = require('fs');
const pathModule = require('path');
// Data CRUD scaffold
const apath = (folder, filename = '') => pathModule.join('./.data', folder, filename).toString();
const crud = {};

crud.create = (folder, filename, data, callback) => {
    const path = apath(folder, filename);
    fs.open(path, 'wx', (errOnOpening, fileDescriptor) => {
        if (!errOnOpening) {
            fs.writeFile(fileDescriptor, data, (errOnWritting) => {
                callback(errOnWritting);
            });
        } else {
            callback(errOnOpening);
        }
    });
};

crud.read = (folder, filename, callback) => {
    const path = apath(folder, filename);
    // console.log(path);
    fs.open(path, 'r', (errOnOpening, fileDescriptor) => {
        if (!errOnOpening) {
            fs.readFile(fileDescriptor, (errOnReading, data) => {
                callback(errOnReading, data);
            });
        } else {
            callback(errOnOpening);
        }
    });
};

crud.update = (folder, filename, data, callback) => {
    const path = apath(folder, filename);
    fs.open(path, 'w', (errOnReading, fileDescriptor) => {
        if (!errOnReading) {
            fs.ftruncate(fileDescriptor, (errOnTruncating) => {
                if (!errOnTruncating) {
                    fs.writeFile(fileDescriptor, data, (errOnWritting) => {
                        callback(errOnWritting);
                    });
                } else {
                    callback(errOnTruncating);
                }
            });
        }
    });
};

crud.delete = (folder, filename, callback) => {
    const path = apath(folder, filename);
    fs.unlink(path, (errOnUnLink) => {
        callback(errOnUnLink);
    });
};

crud.ls = (folder, callback) => {
    fs.readdir(apath(folder), (errOnReadingDir, files) => {
        console.log(files);
        callback(errOnReadingDir, files);
    });
};
module.exports = crud;
