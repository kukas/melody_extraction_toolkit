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
    datasetDirs = [x for x in os.listdir(DATASETS_DIR) if os.path.isdir(os.path.join(DATASETS_DIR, x))]
    return json.dumps(datasetDirs);

@app.route('/datasets/<path:path>')
def getAudio(path):
    return send_from_directory('datasets', path)

@app.route('/')
def root():
    return app.send_static_file('index.html')

if __name__ == "__main__":
    app.run()