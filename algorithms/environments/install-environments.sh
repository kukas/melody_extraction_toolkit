#!/bin/bash

function install_virtualenv {
	echo "Setting up the virtual environment '$1'"
	virtualenv --python=$2 $1
	echo "Installing requirements for '$1'..."
	source $1/bin/activate
	pip install -r requirements-$1.txt
}

echo "installation begin"

install_virtualenv "MelodyExtraction_MCDNN" "python2.7"
install_virtualenv "singing_voice_separation_and_melody_extraction" "python3"
install_virtualenv "SourceFilterContoursMelody" "python2.7"

echo "installation end"
