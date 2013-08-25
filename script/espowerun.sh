#!/bin/sh
set -e
if [ $# != 1 ]; then
    echo "Usage: ./espowerun.sh path/to/test.js"
    exit 0
fi

tmpdir="`basename ${0}`.$$"
mkdir -p ${tmpdir}
trap 'rm -r ${tmpdir}' 0
node `dirname ${0}`/espowerun.js "$1" > ${tmpdir}/$$.js
mocha ${tmpdir}

exit 0