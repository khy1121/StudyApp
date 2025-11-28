#!/bin/sh
set -e

rm -rf output
mkdir -p output

# 현재 디렉터리의 최상위 항목들 중에서
# output, .git 은 제외하고 모두 output/ 으로 복사
find . -mindepth 1 -maxdepth 1 \
  ! -name 'output' \
  ! -name '.git' \
  -exec cp -R {} output/ \;
