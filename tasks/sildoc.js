/*
 * grunt-sildoc
 * https://github.com/Ragnarokkr/grunt-sildoc
 *
 * Copyright (c) 2013 Marco Trulla
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	var // Load required libraries
		path = require( 'path' ),
		_ = grunt.util._,
		// RegExp to filter valid partials
		rePartialFilter = /^_+([^.]+)(?:\..+)*$/i,
		// RegExp to match the forcedly unmanaged tags
		reForcedUnmanagedTag = /<!%(.?)(\s+.*?\s+)%>/ig;

	grunt.registerMultiTask('sildoc', 'Compile your documentation', function() {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			meta: {},
			template: '',
			index: {
				format: 'none',
				mainHeading: false
			}
		}),

		// Buffer for intermediate states of the document. If coerced to String
		// it will return always the last generated state, in order: processed,
		// intermediate, template, and ''.
		doc = {
			index: '',
			template: '',
			intermediate: '',
			processed: '',
			indexer: {
				path: '',
				plugin: null
			},
			toString: function(){
				return this.processed || this.intermediate || this.template || '';
			}
		},

		// Data buffer to pass to the template processor. It's the result of the
		// mixing of global task meta and local sub-task data options.
		data = { meta: _({}).extend( options.meta, options.data || {} ) };

		// Read the template (if was set).
		if ( options.template ) {
			try {
				grunt.verbose.write( 'Reading template "' + options.template + '"...' );
				doc.template = grunt.util.normalizelf( grunt.file.read( options.template ) );
				grunt.verbose.ok();
			} catch ( e ) {
				grunt.verbose.error();
				grunt.log.warn( 'Template file "' + options.template + '" not found.' );
			} // if..else
		} // if

		// Load the indexer (if was set).
		if ( options.index.format !== 'none' ) {
			doc.indexer.path = './lib/indexer_' + options.index.format;
			try {
				grunt.verbose.write( 'Loading indexer "' + doc.indexer.path + '"...' );
				doc.indexer.plugin = require( doc.indexer.path ).init( grunt );
				grunt.verbose.ok();
			} catch ( e ) {
				grunt.verbose.error();
				grunt.log.warn( 'Index format "' + options.index.format + '" not supported.' );
			} // try..catch
		} // if

		// Iterate over all src-dest file pairs.
		this.files.forEach( function( f ) {
			var partials = [ [ /* partialId */ ],[ /* sources */ ] ];

			// Read and store all the partials
			f.src.filter( function( filepath ) {
				// Warn on and remove invalid source files.
				if ( !grunt.file.exists( filepath ) ) {
					grunt.log.warn('Partial file "' + filepath + '" not found.');
					return false;
				} // if

				// Source files are assumed to be real partials only if a
				// template was set, otherwise any kind of file name can be used.
				if ( options.template && !rePartialFilter.test( path.basename( filepath ) ) ) {
					grunt.log.warn('File "' + filepath + '" is not a partial.');
					return false;
				} // if

				return true;
			}).forEach( function( filepath ) {
				// Store all the partials
				var	basename = path.basename( filepath );
				partials[0].push( options.template ? basename.match( rePartialFilter )[1] : basename );
				partials[1].push( grunt.util.normalizelf( grunt.file.read( filepath ) ) );
			});

			// Process the template / concatenate and process partials
			if ( options.template ) {
				// Include partials for processing and (eventually) indexing
				_( data ).extend( { partials: _.object( partials[0], partials[1] ) } );
			} else {
				// Concatenate and process all partials
				doc.template = partials[1].join( grunt.util.linefeed );
			} // if..else

			// Indexing with required indexer.
			if ( doc.indexer.plugin ) {
				// Temporarly inhibit the index tag
				doc.template = String(doc).replace( '<%= index %>', '{{ index }}' );
				// Intermediate processing
				doc.intermediate = grunt.template.process( String(doc), { data: data } );
				// Generate index
				doc.index = doc.indexer.plugin.process( String(doc), options.index );
				_( data ).extend( { index: doc.index } );
				// Re-enable index tag
				doc.intermediate = String(doc).replace( '{{ index }}', '<%= index %>' );
			} // if

			// Final processing
			doc.processed = grunt.template.process( String(doc), { data: data } );

			// Restore the forcedly unmanaged template tags (<!%...%>)
			doc.processed = String(doc).replace( reForcedUnmanagedTag, '<%$1$2%>' );

			// Write the destination file.
			grunt.file.write( f.dest, String(doc) );

			// Print a success message.
			grunt.log.writeln( 'File "' + f.dest + '" created.' );

		});
	});

};
