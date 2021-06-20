#!/bin/sh

set -e

[ -r /container_info.txt ] && cat /container_info.txt

exec ./sfpy-interface -log.level=${LOG_LEVEL:-"info"}
