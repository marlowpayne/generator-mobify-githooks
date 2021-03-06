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
    // Read existing package.json
    var packageJsonPath = './package.json';
    var packageJsonString = this.readFileAsString(packageJsonPath);
    var packageJson = JSON.parse(packageJsonString);

    // Add grunt-githooks dependency to package.json
    if (packageJson.dependencies) {
        packageJson.dependencies['grunt-githooks'] = '0.4.0';
    } else {
        packageJson.dependencies = {
            'grunt-githooks': '0.4.0'
        };
    }

    // Add postinstall npm script to set up githooks to package.json
    if (packageJson.scripts) {
        packageJson.scripts['postinstall'] = 'grunt githooks';
    } else {
        packageJson.scripts = {
            'postinstall': 'grunt githooks'
        };
    }

    // Write package.json file back out
    this.writeFileFromString(JSON.stringify(packageJson, null, 2), packageJsonPath); // Our package.json uses 2 spaces as whitespace

    // Copy githooks tasks/config/githooks.js and tasks/hooks/tasks.js
    this.copy('githooks.js', 'tasks/config/githooks.js');
    this.copy('tasks.js', 'tasks/hooks/tasks.js');

    // Leverage npm scripts to set up githooks
    this.on('end', function() {
        this.spawnCommand('npm', ['install']);
    });
};

module.exports = GithooksGenerator;
