'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var GithooksGenerator = yeoman.generators.Base.extend({
    init: function() {
        this.log(this.yeoman);
        this.log(chalk.yellow(
            'Updating package.json with grunt-githooks dependency and setting up Mobify\'s git hooks...\n'
        ));
    }
});

GithooksGenerator.prototype.app = function app() {
    // Read existing package.json
    var packageJsonPath = './package.json';
    var packageJsonFile = this.readFileAsString(packageJsonPath);

    // Check that grunt-githooks isn't already in package.json
    if (!/"grunt-githooks"/g.test(packageJsonFile)) {

        var dependenciesIndex = packageJsonFile.lastIndexOf('dependencies');

        var dependenciesString = packageJsonFile.slice(dependenciesIndex);

        var indexForDependencyInsertion = dependenciesIndex + dependenciesString.indexOf('}');

        // Add grunt-githooks dependency to existing package.json
        packageJsonFile = packageJsonFile.slice(0, indexForDependencyInsertion - 1) + ',\n"grunt-githooks": "0.3.1"\n' + packageJsonFile.slice(indexForDependencyInsertion);
    }

    if (!/"scripts"/g.test(packageJsonFile)) {
        // TODO: Add postinstall npm scripts
    }

    // TODO: Write package.json file back out

    // Copy githooks tasks/config/githooks.js and tasks/hooks/tasks.js
    this.copy('githooks.js', 'tasks/config/githooks.js');
    this.copy('tasks.js', 'tasks/hooks/tasks.js');

    // Leverage npm scripts to set up githooks
    this.on('end', function() {
        this.npmInstall();
    });
};

module.exports = GithooksGenerator;
