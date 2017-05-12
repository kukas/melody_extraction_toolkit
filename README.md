# melody_extraction
Web application implementing and visualising state-of-the-art methods for melody extraction

## about
This is a semestral project that precedes my bachelor thesis on the same subject. 

## Installation

To install virtual environments (needed for running the algorithms), please run `algorithms/environments/install-environments.sh`.

The _SourceFilterContoursMelody_ algorithm requires [Essentia](http://essentia.upf.edu/documentation/) which needs to be installed to the respective _virtualenv_.

## goals

* frontend
	* create a graphical interface for visualising and interacting with selected algorithms
		* uploading audio
			* optional: add youtube as a possible source for extraction
		* setting parameters using a custom API
		* plotting extracted melody on piano-roll
			* plotting gold standard, if available
	* compare evaluation results between algorithms
* backend
	* automated evaluation of selected algorithm according to MIREX evaluation procedure
	* 

## technologies
* front-end: javascript
	* 

## selected methods



Upload audio
sanitizing, checking formats, …
Evaluate extraction, including OrchSet
incl. visualization
MIDI visualization
State of the art metody, API pro nové extrahovací metody
Baseline extrakce
Případně: Batch processing of data?
Syntetická data?
