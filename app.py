from flask import Flask, send_from_directory
import subprocess
import os
import json
app = Flask(__name__, static_url_path='')
app.config['DEBUG'] = True
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

DATASETS_DIR = "./datasets"

# @app.route("/")
# def hello():
#     # os.chdir("algorithms/MelodyExtraction_MCDNN")
#     # out = subprocess.check_output(["./extract.sh", "0_my_req_test/jazz4.wav", "SAVE_RESULTS/test-flask.txt"])
#     # print(type(out))
#     # return "<pre>"+out.decode()+"</pre>"
#     return "hello wolrd"
#     # return check_output(["ls","-al"])

@app.route('/getDatasets')
def getDatasets():
    def getClip(clip):
        filename = os.path.basename(clip[0]) # removes the path
        filename = os.path.splitext(filename)[0] # removes the extension
        return {'name': filename, 'audio': clip[0], 'ref': clip[1]}

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
    return send_from_directory('datasets', path)

@app.route('/')
def root():
    return app.send_static_file('index.html')

if __name__ == "__main__":
    app.run()