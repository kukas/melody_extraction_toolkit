#!/bin/bash

# change directory to this scripts folder
# (for relative paths to work)
cd "$(dirname ${BASH_SOURCE[0]})"

source switch_virtualenv

switch_virtualenv "SourceFilterContoursMelody"
cd src/
python MelodyExtractionFromSingleWav.py $input $output --extractionMethod='BG1' --hopsize=0.01 --nb-iterations=30
