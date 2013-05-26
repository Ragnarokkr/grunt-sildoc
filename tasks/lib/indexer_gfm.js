/*
 * grunt-sildoc
 * https://github.com/Ragnarokkr/grunt-sildoc
 *
 * Copyright (c) 2013 Marco Trulla
 * Licensed under the MIT license.
 */

'use strict';

exports.init = function( grunt ) {
	var exports = {},
		_ = grunt.util._;

	// Indexer for GitHub markdown documents.
	//
	// Parameters:
	//	intermediate => the processed JS template
	//
	// Return:
	//	String => the generated index
	//
	exports.process = function( intermediate, options ) {
		var headingRegExp = '^(#{' + (options.mainHeading ? 1 : 2) + ',}) (.+)$',
			reHeadings = new RegExp( headingRegExp, 'igm' ),
			reHeading = new RegExp( headingRegExp, 'i' ),
			toc = [],
			headings;

		// Build TOC
		headings = intermediate.match( reHeadings );
		headings.forEach( function( heading ) {
			var chapter = heading.match( reHeading ),
				level = chapter[1].length,
				indent = (level - (options.mainHeading ? 1 : 2)) * 4;

			toc.push(
				grunt.util.repeat( indent, ' ' ) +
					'* [' + chapter[2] + '](' + '#' + _( chapter[2] ).slugify() + ')'
			);
		});

		return toc.join('\n');
	};

	return exports;
};
