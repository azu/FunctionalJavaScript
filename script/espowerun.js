/**
 * Created by azu on 2013/08/23.
 */
var espower = require('espower'), esprima = require('esprima'), escodegen = require('escodegen');
var fs = require('fs'), path = require('path');
var sys = require('sys');
var userArgs = process.argv.slice(2);
var filePath = path.resolve(process.cwd(), userArgs[0]);
var absPath = fs.realpathSync(filePath), jsCode = fs.readFileSync(filePath, 'utf-8');
var jsAst = esprima.parse(jsCode, {tolerant: true, loc: true, range: true});
var espowerOptions = {
    path: absPath,
    source: jsCode
};
var modifiedAst = espower(jsAst, espowerOptions);
sys.print(escodegen.generate(modifiedAst));