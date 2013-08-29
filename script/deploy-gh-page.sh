#!/bin/sh

git checkout -B gh-pages
git rebase master
citare --out "./"
git add -u
git add .
printf "${MESSAGE}\n\n%s" "`git diff --cached`" | git commit -F -
git push origin gh-pages
git checkout -
