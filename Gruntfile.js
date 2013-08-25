module.exports = function (grunt) {
    grunt.initConfig({
        mochaTest: {
            chapter: {
                options: {
                    reporter: 'dot'
                },
                src: ['Chapter*/**/*.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('test', ['mochaTest:chapter']);
};