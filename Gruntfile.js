module.exports = function(grunt) {

    'use strict';

    var ipAddress = require('network-address')();
    require('load-grunt-tasks')(grunt);
    //require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // 全局变量
        banner: '/*! Project: <%= pkg.name %>\n *  Version: <%= pkg.version %>\n *  Date: <%= grunt.template.today("yyyy-mm-dd hh:MM:ss TT") %>\n *  Author: <%= pkg.author %>\n */',

        connect: {
            site_src: {
                options: {
                    hostname: ipAddress,
                    port: 9000,
                    base: ['src/'],
                    livereload: true,
                    open: true //打开默认浏览器
                }
            },
            site_dest: {
                options: {
                    hostname: ipAddress,
                    port: 9001,
                    base: ['dest/'],
                    livereload: true,
                    keepalive: true, //保持sever不退出
                    open: true //打开默认浏览器
                }
            }
        },
        cssmin: {
            options: {
                /* ext: '.min.css', 添加后缀 */
                banner: '<%= banner %>'
            },
            minify: {
                expand: true,
                cwd: 'dest/css',
                src: '**/*.css',
                dest: 'dest/css',
                ext: '.css'
            }
        },
        uglify: {
            options: {
                /* report: 'min', */
                banner: '<%= banner %>',
                mangle: true //压缩函数、变量名
            },
            my_target: {
                files: [{
                    expand: true,
                    cwd: 'dest/js',
                    src: '**/*.js',
                    dest: 'dest/js'
                }]
            }
        },
        clean: {
            build: ["dest"],
            release: ["dest/slice"]
        },
        copy: {
            release: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**', '!sass', '!sass/{,*/}*', '!img/psd', '!img/psd/{,*/}*'],
                    dest: 'dest/'
                }]
            }
        },
        autoprefixer: {
            options: {
                browsers: ['> 1%', 'last 2 versions', 'ff 17', 'opera 12.1', 'ie 8']
            },
            dest: {
                expand: true,
                flatten: true,
                src: 'src/css/*.css',
                dest: 'dest/css/'
            }
        },
        watch: {
            css: {
                files: ['src/sass/{,*/}*.scss'],
                tasks:['sass']
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: ['src/*.html', 'src/css/*.css', 'src/js/*.js']
            }
        },
        imagemin: {
            dest: {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    cwd: 'dest/img/',
                    src: ['{,*/}*.{png,jpg,jpeg,gif}'],
                    dest: 'dest/img/'
                }]
            }
        },
        sprite: {
            allslice: {
                files: [{
                    expand: true,
                    cwd: 'dest/css/',
                    src: ['*.css'],
                    dest: 'dest/',
                    ext: '.css'
                }],
                options: {
                    'engine': 'gm',
                    'algorithm': 'binary-tree',
                    'imagestamp': true,
                    'cssstamp': true
                }
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'compressed', //nested, compact, compressed, expanded
                    lineNumbers: true //sass文件对应的行号
                },
                files: [{
                    expand: true,
                    cwd: 'src/sass',
                    src: ['*.scss'],
                    dest: 'src/css',
                    ext: '.css'
                }]
            }
        }
    });

    // 默认任务
    grunt.registerTask('default', ['connect:site_src', 'watch']);

    // webserver 查看发布目录
    grunt.registerTask('dest', ['connect:site_dest']);

    // 发布任务
    grunt.registerTask('release', ['clean:build', 'sass', 'copy','sprite', 'uglify', 'imagemin', 'clean:release', 'connect:site_dest']);

};
