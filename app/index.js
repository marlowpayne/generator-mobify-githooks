'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var GithooksGenerator = yeoman.generators.Base.extend({
    init: function() {
        this.log(chalk.yellow(
            'Updating package.json with grunt-githooks dependency and setting up Mobify\'s git hooks...\n'
        ));
    }
});

GithooksGenerator.prototype.app = function app() {
    var _getIndexForDependencyInsertion = function(fileString) {
        var dependenciesIndex = fileString.lastIndexOf('dependencies');

        var dependenciesString = fileString.slice(dependenciesIndex);

        return dependenciesIndex + dependenciesString.indexOf('}');
    };

    // Read existing package.json
    var packageJsonPath = './package.json';
    var packageJsonString = this.readFileAsString(packageJsonPath);
    var packageJson = JSON.parse(packageJsonString);

    packageJson.dependencies['grunt-githooks'] = '0.3.1';

    packageJson.scripts = packageJson.scripts ? packageJson.scripts['postinstall'] = 'grunt githooks' : {
        'postinstall': 'grunt githooks'
    };

    // Write package.json file back out
    this.writeFileFromString(JSON.stringify(packageJson, null, 4), packageJsonPath); // 4 spaces as tabs

    // Copy githooks tasks/config/githooks.js and tasks/hooks/tasks.js
    this.copy('githooks.js', 'tasks/config/githooks.js');
    this.copy('tasks.js', 'tasks/hooks/tasks.js');

    // Leverage npm scripts to set up githooks
    this.on('end', function() {
        this.spawnCommand('npm', ['install']);
    });
};

module.exports = GithooksGenerator;
