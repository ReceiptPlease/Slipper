#!usr/bin/env bash

clear

deno run            \
    --allow-write   \
    --allow-read    \
    Source/cli.ts   \
    --config=Test/Slipper.toml
