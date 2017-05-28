#!/bin/bash

input=$(realpath $1)
output=$(realpath $2)

# change directory to this scripts folder
# (for relative paths to work)
cd "$(dirname ${BASH_SOURCE[0]})"

source switch_virtualenv

switch_virtualenv "MelodyExtraction_MCDNN"
python main.py 0.2 $input $output
