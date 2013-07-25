module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify:{
            files: [
                {
                    expand: true,
                    cwd: 'dist/',
                    src: 'app.js',
                    dest: 'dist/',
                    ext: '.js'
                }
            ]
        } 
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('build',['uglify']);
};
