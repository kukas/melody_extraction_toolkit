#!/bin/bash

# change directory to this scripts folder
# (for relative paths to work)
cd "$(dirname ${BASH_SOURCE[0]})"

source switch_virtualenv

switch_virtualenv "singing_voice_separation_and_melody_extraction"
python separation.py $input $output
