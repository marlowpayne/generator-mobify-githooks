module.exports = function(grunt) {
    return {
        all: {
            'pre-commit': 'eslint:prod'
        }
    };
};
