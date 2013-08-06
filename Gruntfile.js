module.exports = function(grunt){
    var transport = require('grunt-cmd-transport');
    var style = transport.style.init(grunt);
    var text = transport.text.init(grunt);
    var script = transport.script.init(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean:{
            src: ['.build']
        },
        transport:{
            options: {
                debug: false,
                paths: ['public/javascripts/'], //seajs的当前路径
                alias: '<%= pkg.spm.alias %>',
                parser:{
                    '.js' : [script.jsParser],
                    '.css' : [style.css2jsParser],
                    '.html' : [text.html2jsParser]
                }
            },
            styles:{
                options:{
                    debug: false,
                    idleading: 'styles/'
                },
                files:[
                    {
                        cwd: 'public/stylesheets', //这个才是当前路径啊，相对于项目的路径
                        src: '**/*.css',
                        filter: 'isFile',
                        dest: '.build/styles'
                    }
                ]
            },
            javascripts:{
                options:{
                    debug: false,
                    idleading: 'http://127.0.0.1:3000/javascripts/'
                },
                files:[
                    {
                        cwd: 'public/javascripts', //这个才是当前路径啊，相对于项目的路径
                        src: ['main/*.js', 'plugins/*.js', 'thirdparty/*.js', '!thirdparty/jquery*.js', '!thirdparty/underscore*.js'],
                        filter: 'isFile',
                        dest: '.build/js'
                    }
                ]
            }
        },
        concat:{
            javascripts: {
                options: {
                    paths: ['.'],
                    include: 'all'
                },
                files:[
                    {
                        "public/javascripts/<%= pkg.injsname %>.js": ['.build/js/**/*.js']
                    }
                ]
            }
        },
        uglify:{
            dist:{
                src: 'public/javascripts/<%= pkg.injsname%>.js',
                dest: 'public/javascripts/<%= pkg.injsname %>.min.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('build',['clean', 'transport', 'concat', 'uglify']);
    grunt.registerTask('default',['build']);
};
