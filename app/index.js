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
    var _getIndexForDependencyInsertion = function(fileString) {
        var dependenciesIndex = fileString.lastIndexOf('dependencies');

        var dependenciesString = fileString.slice(dependenciesIndex);

        return dependenciesIndex + dependenciesString.indexOf('}');
    };

    // Read existing package.json
    var packageJsonPath = './package.json';
    var packageJsonFile = this.readFileAsString(packageJsonPath);

    // Check that grunt-githooks isn't already in package.json
    if (!/"grunt-githooks"/g.test(packageJsonFile)) {

        var indexForDependencyInsertion = _getIndexForDependencyInsertion(packageJsonFile);

        // Add grunt-githooks dependency to existing package.json
        packageJsonFile = packageJsonFile.slice(0, indexForDependencyInsertion - 1) + ',\n"grunt-githooks": "0.3.1"\n' + packageJsonFile.slice(indexForDependencyInsertion);
    }

    if (!/"scripts"/g.test(packageJsonFile)) {
        // Insert postinstall script after dependencies
        var indexForMissingScriptsInsertion = _getIndexForDependencyInsertion(packageJsonFile) + 1;

        // Be prepared for entries after dependencies
        if (indexForMissingScriptsInsertion === ',') {
            packageJsonFile = packageJsonFile.slice(0, indexForMissingScriptsInsertion + 1) + '\n"scripts": {"postinstall": "grunt githooks"},\n' + packageJsonFile.slice(indexForMissingScriptsInsertion);
        } else {
            packageJsonFile = packageJsonFile.slice(0, indexForMissingScriptsInsertion) + ',\n"scripts": {"postinstall": "grunt githooks"}\n' + packageJsonFile.slice(indexForMissingScriptsInsertion);
        }
    } else {
        var scriptsIndex = packageJsonFile.lastIndexOf('scripts');
        var scriptsString = packageJsonFile.slice(scriptsIndex);
        // Check for postinstall script
        if (!/"postinstall"/g.test(scriptsString)) {
            // Add postinstall script
            var indexForExistingScriptsInsertion = scriptsIndex + scriptsString.indexOf('}');

            // Check for empty object case
            if (packageJsonFile.charAt(indexForExistingScriptsInsertion - 1) === '{') {
                packageJsonFile = packageJsonFile.slice(0, indexForExistingScriptsInsertion) + '\n"postinstall": "grunt githooks"\n' + packageJsonFile.slice(indexForExistingScriptsInsertion);
            } else {
                packageJsonFile = packageJsonFile.slice(0, indexForExistingScriptsInsertion - 1) + ',\n"postinstall": "grunt githooks"\n' + packageJsonFile.slice(indexForExistingScriptsInsertion);
            }
        }
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
