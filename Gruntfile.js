
module.exports = function(grunt) 
{
	
	require('time-grunt')(grunt); //  for estimation
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		composer : {
				options : {
					usePhp: true,
					phpArgs: {
						allow_url_fopen: 'on'
					},
					flags: ['no-dev'],
					composerLocation: '/usr/local/bin/composer'
				},
				build:{

				}
			},

		uglify: {
			production: { 
				options: {
				},
				build: {
					
						files: [{
						expand: true,
						flatten: false,
						cwd: 'wp-content/themes/krds/',
						ext: '.js',
						src: ['**/*.js', '!*.min.js'],
						filter: 'isFile',
						dest: 'wp-content/themes/krds/'
					}]
				}
			}
		},
			
		cssmin: {
			production: { 
				target: {
				  files: [{
					expand: true,
					flatten: false,
					cwd: 'wp-content/themes/krds/',
					ext: '.css',
					src: ['*.css', '!*.min.css'],
					filter: 'isFile',
					dest: 'wp-content/themes/krds/'
					
				  }]
				}
			}
		},

		prompt: {
	        target: {
	            options: {
	                questions: [
	                    {
	                        config: 'projecturl',
	                        type: 'input',
	                        message: 'Enter Project url (ex: http://localhost/wordpress/wp/)',
	                        validate: function(value){
	                            if(value == '') {
	                                return 'Should not be blank';
	                            }
	                            return true;
	                        }
	                    }                       
	                ]
	            }
	        }
    	},

		'string-replace': {
				prod: {
				  files: [{
					expand: true,
					flatten: false,
					cwd: 'wp-content/themes/krds/',
					ext: '.css',
					src: ['**/*.css'],
					filter: 'isFile',
					dest: 'wp-content/themes/krds/'
				  }],
				  options: {
					replacements: [{
						pattern: /\.(jpg|jpeg|png|gif|svg)/g,
						replacement: '.$1?v=1'

					}]
				  }
				},

				dev: {
					files: [{
						src: 'wp/wp-config.php',
						dest: 'wp/wp-config.php'
					  }],
					  options: {
						replacements: [{
							pattern: /project url/ig,
							replacement: '<%= projecturl %>'

						}]
					  }
					}
		},

		copy: {
	        main: {
	            files: [
	                {
	                    expand: true,
	                    cwd:'vendor/custom-wptheme',
	                    src: '**',
	                    dest: 'wp/wp-content/themes/krds/'
	                },
	                {
	                    expand: true,
	                    cwd:'vendor/wp-autoconfig',
	                    src: '**',
	                    dest: 'wp/'
	                }
	           ]
	        }
	      },

	      clean: {
	      	before: ["wp/wp-content/themes/*/","wp/wp-content/plugins/hello.php","wp/wp-config-sample.php"],
	      	after: ["vendor/custom-wptheme", "vendor/wp-autoconfig"]
	    }
});
	 
	grunt.loadNpmTasks('grunt-composer');
	grunt.loadNpmTasks('grunt-wordpress-deploy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-string-replace');
	grunt.loadNpmTasks('grunt-prompt');

	grunt.registerTask('dev', ['composer:build:install', 'clean:before', 'copy', 'clean:after', 'prompt:target', 'string-replace:dev']);    
	grunt.registerTask('production', ['uglify:production', 'cssmin:production', 'string-replace:prod']);

};

