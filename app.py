from flask import Flask, send_from_directory, request, redirect, url_for, abort
import hashlib
import subprocess
import os
import re
import sys
import json

UPLOADS_DIR = "./uploads"
DATASETS_DIR = "./datasets"
ALGORITHMS_DIR = "./algorithms"
ESTIMATIONS_DIR = "./estimations"
ALLOWED_EXTENSIONS = ['wav']


app = Flask(__name__, static_url_path='')
app.config['DEBUG'] = True
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['UPLOAD_FOLDER'] = UPLOADS_DIR



def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            abort(400) # 400 Bad Request

        file = request.files['file']

        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            abort(400) # 400 Bad Request

        # extension whitelist check
        if not allowed_file(file.filename):
            abort(415) # 415 Unsupported Media Type

        # sanitize/replace filename
        filename = hashlib.md5(file.read()).hexdigest() + ".wav"
        filepath = os.path.join(UPLOADS_DIR, filename)
        # seek because file.read() moves the stream position to the end
        file.seek(0)
        # save file
        file.save(filepath)

        # check header (file command checks for "RIFF....WAVE" at the beginning of the uploaded file)
        filetype = subprocess.check_output(["file", "-b", filepath]).decode(sys.stdout.encoding)
        if not ("WAVE audio" in filetype):
            os.remove(filepath)
            abort(415) # 415 Unsupported Media Type
        
        # validate wav structure
        try:
            fileinfo = subprocess.check_output(["shntool", "info", "-i", "wav", filepath]).decode(sys.stdout.encoding)
        except subprocess.CalledProcessError as e:
            os.remove(filepath)
            abort(415) # 415 Unsupported Media Type

        # structure checks
        inconsistent_header_check = re.search('^\s*Inconsistent header:\s*yes', fileinfo, re.MULTILINE)
        file_truncated_check = re.search('^\s*File probably truncated:\s*yes', fileinfo, re.MULTILINE)
        junk_check = re.search('^\s*Junk appended to file:\s*yes', fileinfo, re.MULTILINE)
        if inconsistent_header_check or file_truncated_check or junk_check:
            os.remove(filepath)
            abort(403) # 403 Forbidden

        return filename

    abort(405)

def getName(filename):
    filename = os.path.basename(filename) # removes the path
    filename = os.path.splitext(filename)[0] # removes the extension

    return filename

@app.route("/getEstimation/<algorithm>/<dataset>/<path:clip>")
def getEstimation(algorithm, dataset, clip):
    algorithmScript = algorithm+".sh"
    if not algorithmScript in os.listdir(ALGORITHMS_DIR):
        return "invalid algorithm", 403

    if dataset == "upload":
        if not clip in os.listdir(UPLOADS_DIR):
            return "invalid upload", 403
        inputPath = os.path.join(UPLOADS_DIR, clip)
    else:
        if not dataset in os.listdir(DATASETS_DIR):
            return "invalid dataset", 403
        inputPath = os.path.join(DATASETS_DIR, dataset, clip)

    scriptPath = os.path.join(ALGORITHMS_DIR, algorithmScript)

    outputFilename = algorithm+"-"+dataset+"-"+getName(clip)+".txt"
    outputPath = os.path.join(ESTIMATIONS_DIR, outputFilename)

    if not os.path.isfile(outputPath):
        command = [scriptPath, inputPath, outputPath]
        print("running:", " ".join(command))
        out = subprocess.check_output(command)

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
