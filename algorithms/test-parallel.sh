./MelodyExtraction_MCDNN.sh ../datasets/adc2004_full_set/pop2.wav ../estimations/pop2.txt &
./SourceFilterContoursMelody.sh ../datasets/adc2004_full_set/pop2.wav ../estimations/pop2.txt &
./singing_voice_separation_and_melody_extraction.sh ../datasets/adc2004_full_set/pop2.wav ../estimations/pop2.txt &
./MelodyExtraction_MCDNN.sh ../datasets/adc2004_full_set/pop2.wav ../estimations/pop2.txt &
./SourceFilterContoursMelody.sh ../datasets/adc2004_full_set/pop2.wav ../estimations/pop2.txt &
./singing_voice_separation_and_melody_extraction.sh ../datasets/adc2004_full_set/pop2.wav ../estimations/pop2.txt &
./MelodyExtraction_MCDNN.sh ../datasets/adc2004_full_set/pop2.wav ../estimations/pop2.txt &
./SourceFilterContoursMelody.sh ../datasets/adc2004_full_set/pop2.wav ../estimations/pop2.txt &
./singing_voice_separation_and_melody_extraction.sh ../datasets/adc2004_full_set/pop2.wav ../estimations/pop2.txt &

wait
echo "test ukončen"