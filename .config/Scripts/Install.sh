#!usr/bin/env bash

clear

deno install                           \
    --force                            \
    --unstable                         \
    --name slipper                     \
    --allow-write                      \
    --allow-read                       \
    --import-map=Source/Imports.json   \
    Source/cli.ts
