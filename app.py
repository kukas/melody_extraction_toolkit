from flask import Flask, send_from_directory
import subprocess
import os
import json
app = Flask(__name__, static_url_path='')
app.config['DEBUG'] = True
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

DATASETS_DIR = "./datasets"
ALGORITHMS_DIR = "./algorithms"
ESTIMATIONS_DIR = "./estimations"

# returns 
def getName(filename):
    filename = os.path.basename(filename) # removes the path
    filename = os.path.splitext(filename)[0] # removes the extension

    return filename


@app.route("/getEstimation/<algorithm>/<dataset>/<path:clip>")
def getEstimation(algorithm, dataset, clip):
    algorithm += ".sh"
    if not algorithm in os.listdir(ALGORITHMS_DIR):
        return "invalid algorithm", 403
    
    if not dataset in os.listdir(DATASETS_DIR):
        return "invalid dataset", 403

    # if not dataset in os.listdir(DATASETS_DIR):
    #     return "invalid clip path", 403

    # os.chdir("algorithms/MelodyExtraction_MCDNN")
    scriptPath = os.path.join(ALGORITHMS_DIR, algorithm)
    inputPath = os.path.join(DATASETS_DIR, dataset, clip)

    outputFilename = getName(clip)+".txt"
    outputPath = os.path.join(ESTIMATIONS_DIR, outputFilename)

    if not os.path.isfile(outputPath):
        out = subprocess.check_output([scriptPath, inputPath, outputPath])
    # print(type(out))
    # return "<pre>"+out.decode()+"</pre>"
    # return "hello wolrd"
    # return subprocess.check_output(["ls","-al"])
    return send_from_directory(ESTIMATIONS_DIR, outputFilename)


@app.route('/getAlgorithms')
def getAlgorithms():
    algorithms = []
    for x in os.listdir(ALGORITHMS_DIR):
        head, tail = os.path.splitext(x)
        if tail == ".sh" and os.path.isfile(os.path.join(ALGORITHMS_DIR, x)):
            algorithms.append(head)

    return json.dumps(algorithms);

@app.route('/getDatasets')
def getDatasets():
    def getClip(clip):
        return {'name': getName(clip[0]), 'audio': clip[0], 'ref': clip[1]}

    datasetDirs = [x for x in os.listdir(DATASETS_DIR) if os.path.isdir(os.path.join(DATASETS_DIR, x))]

    datasets = []
    for dataDir in datasetDirs:
        filelistPath = os.path.join(DATASETS_DIR, dataDir, "filelist.txt")
        if os.path.isfile(filelistPath):
            with open(filelistPath) as f:
                content = f.readlines()
            # remove whitespaces
            content = [x.strip() for x in content]
            datasets.append({
                'id': dataDir,
                'name': content[0],
                'clips': [getClip(line.split()) for line in content[1:]]
                })

    return json.dumps(datasets);

@app.route('/datasets/<path:path>')
def getAudio(path):
    return send_from_directory(DATASETS_DIR, path)

@app.route('/')
def root():
    return app.send_static_file('index.html')

if __name__ == "__main__":
    app.run(threaded=True)
