module.exports = function (grunt) {
    grunt.initConfig({
        destDir: 'espowered_tests',
        clean: {
            power_assert: ['<%= destDir %>/']
        },
        espower: {
            power_assert: {
                files: [
                    {
                        expand: true,        // Enable dynamic expansion.
                        src: ['Chapter1/*.js'],    // Actual pattern(s) to match.
                        cwd: './',
                        dest: '<%= destDir %>/',  // Destination path prefix.
                        ext: '.js'           // Dest filepaths will have this extension.
                    }
                ]
            }
        },
        // Configure a mochaTest task
        mochaTest: {
            power_assert: {
                src: ['<%= destDir %>/**/*.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-espower');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('test',  ['clean:power_assert', 'espower:power_assert', 'mochaTest:power_assert']);
};