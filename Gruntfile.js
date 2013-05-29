/*
 * grunt-sildoc
 * https://github.com/Ragnarokkr/grunt-sildoc
 *
 * Copyright (c) 2013 Marco Trulla
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		// Meta
		pkg: grunt.file.readJSON( 'package.json' ),

		// Before deploying, increment version number.
		bump: {
			options: {
				part: 'patch',
				hardTab: true
			},
			files: [ 'package.json' ]
		},

		// Before anything else, check JS files for correctness.
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js',
				'<%= nodeunit.tests %>'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: ['tmp'],
			doc: ['./README.md']
		},

		// Configuration to be run (and then tested).
		sildoc: {
			options: {
				meta: {
					lorem: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, commodi, quisquam, autem quasi aliquam nobis quidem voluptates sed dolorem inventore molestias cupiditate officiis non maiores iure aperiam exercitationem natus mollitia.'
				}
			},
			singleNoIndexLC: {
				options: {
					data: {
						upcase: false
					}
				},
				src: [ './test/fixtures/single_no_index.md.jst' ],
				dest: './tmp/single_no_index_lc.md'
			},
			singleNoIndexUC: {
				options: {
					data: {
						upcase: true
					}
				},
				src: [ './test/fixtures/single_no_index.md.jst' ],
				dest: './tmp/single_no_index_uc.md'
			},
			singleIndex: {
				options: {
					index: {
						format: 'gfm'
					}
				},
				src: [ './test/fixtures/single_index.md.jst' ],
				dest: './tmp/single_index.md'
			},
			singleIndexMain: {
				options: {
					index: {
						format: 'gfm',
						mainHeading: true
					}
				},
				src: [ './test/fixtures/single_index.md.jst' ],
				dest: './tmp/single_index_main.md'
			},
			multiNoIndex: {
				src: [ './test/fixtures/_header.md.jst', './test/fixtures/_*.md.jst' ],
				dest: './tmp/multi_no_index.md'
			},
			multiIndex: {
				options: {
					data: {
						multi: true
					},
					index: {
						format: 'gfm'
					}
				},
				src: [ './test/fixtures/_header.md.jst', './test/fixtures/_*.md.jst' ],
				dest: './tmp/multi_index.md'
			},
			templateNoIndex: {
				options: {
					template: './test/fixtures/template_no_index.md.jst'
				},
				src: [ './test/fixtures/_*.md.jst', '!./test/fixtures/_multi*.md.jst' ],
				dest: './tmp/template_no_index.md'
			},
			templateIndex: {
				options: {
					index: {
						format: 'gfm'
					},
					template: './test/fixtures/template_index.md.jst'
				},
				src: [ './test/fixtures/_*.md.jst', '!./test/fixtures/_multi*.md.jst' ],
				dest: './tmp/template_index.md'
			},
			doc: (function(){
				if ( grunt.option('deploy') ) {
					return {
						options: {
							data: {
								name: '<%= pkg.name %>',
								description: '<%= pkg.description %>',
								gruntVersion: '<%= pkg.devDependencies.grunt %>',
								gemnasium: {
									userId: 'Ragnarokkr'
								}
							},
							template: './src-doc/readme.md.jst'
						},
						src: [ './src-doc/_*.md.jst' ],
						dest: './README.md'
					};
				} else {
					return {};
				}
			}())
		},

		// Unit tests.
		nodeunit: {
			tests: ['test/*_test.js']
		}

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', ['clean', 'sildoc', 'nodeunit']);

	// By default, lint and run all tests.
	grunt.registerTask('default', ['jshint', 'test']);

};
