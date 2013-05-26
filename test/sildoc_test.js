'use strict';

var grunt = require('grunt');

/*
	======== A Handy Little Nodeunit Reference ========
	https://github.com/caolan/nodeunit

	Test methods:
		test.expect(numAssertions)
		test.done()
	Test assertions:
		test.ok(value, [message])
		test.equal(actual, expected, [message])
		test.notEqual(actual, expected, [message])
		test.deepEqual(actual, expected, [message])
		test.notDeepEqual(actual, expected, [message])
		test.strictEqual(actual, expected, [message])
		test.notStrictEqual(actual, expected, [message])
		test.throws(block, [error], [message])
		test.doesNotThrow(block, [error], [message])
		test.ifError(value)
*/

exports.sildoc = {
	setUp: function(done) {
		// setup here if necessary
		done();
	},
	'Single - No index - Lower case': function(test) {
		test.expect(1);

		var actual = grunt.file.read('tmp/single_no_index_lc.md');
		var expected = grunt.file.read('test/expected/single_no_index_lc.md');
		test.equal(actual, expected, 'should contains all paragraphs in lowercase.');

		test.done();
	},
	'Single - No index - Uppercase': function(test) {
		test.expect(1);

		var actual = grunt.file.read('tmp/single_no_index_uc.md');
		var expected = grunt.file.read('test/expected/single_no_index_uc.md');
		test.equal(actual, expected, 'should contains all paragraphs in uppercase.');

		test.done();
	},
	'Single - Index - Lowercase': function(test) {
		test.expect(1);

		var actual = grunt.file.read('tmp/single_index.md');
		var expected = grunt.file.read('test/expected/single_index.md');
		test.equal(actual, expected, 'should contains an index and lowercase paragraphs.');

		test.done();
	},
	'Single - Index Main - Lowercase': function(test) {
		test.expect(1);

		var actual = grunt.file.read('tmp/single_index_main.md');
		var expected = grunt.file.read('test/expected/single_index_main.md');
		test.equal(actual, expected, 'should contains an index with main heading, and lowercase paragraphs.');

		test.done();
	},
	'Multi - No index - Lowercase': function(test) {
		test.expect(1);

		var actual = grunt.file.read('tmp/multi_no_index.md');
		var expected = grunt.file.read('test/expected/multi_no_index.md');
		test.equal(actual, expected, 'should contains no title, and all paragraphs in lowercase.');

		test.done();
	},
	'Multi - Index - Lowercase': function(test) {
		test.expect(1);

		var actual = grunt.file.read('tmp/multi_index.md');
		var expected = grunt.file.read('test/expected/multi_index.md');
		test.equal(actual, expected, 'should contains no title, an index, and lowercase paragraphs.');

		test.done();
	},
	'Template - No index - Lowercase': function(test) {
		test.expect(1);

		var actual = grunt.file.read('tmp/template_no_index.md');
		var expected = grunt.file.read('test/expected/template_no_index.md');
		test.equal(actual, expected, 'should contains all paragraphs in lowercase.');

		test.done();
	},
	'Template - Index - Lowercase': function(test) {
		test.expect(1);

		var actual = grunt.file.read('tmp/template_index.md');
		var expected = grunt.file.read('test/expected/template_index.md');
		test.equal(actual, expected, 'should contains an index and lowercase paragraphs.');

		test.done();
	}
};
