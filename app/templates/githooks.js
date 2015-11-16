module.exports = function(grunt) {
    return {
        all: {
            'pre-commit': 'lint:prod'
        }
    };
};
