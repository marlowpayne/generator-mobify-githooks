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
    this.copy('package.json', 'package.json'); // TEST package.json
    // TODO: Read existing package.json

    // TODO: Add grunt-githooks dependency to existing package.json

    // TODO: Copy githooks tasks/config/githooks.js and tasks/hooks/tasks.js
    this.copy('githooks.js', 'tasks/config/githooks.js');
    this.copy('tasks.js', 'tasks/hooks/tasks.js');

    // TODO: Run 'grunt githooks' for user
    // this.spawnCommand('grunt', ['githooks']);

    this.on('end', function() {
        this.npmInstall();
    });
};

module.exports = GithooksGenerator;
