from flask import Flask
import subprocess
import os
app = Flask(__name__, static_url_path='')
app.config['DEBUG'] = True

@app.route("/")
def hello():
    # os.chdir("algorithms/MelodyExtraction_MCDNN")
    # out = subprocess.check_output(["./extract.sh", "0_my_req_test/jazz4.wav", "SAVE_RESULTS/test-flask.txt"])
    # print(type(out))
    # return "<pre>"+out.decode()+"</pre>"
    return "hello wolrd"
    # return check_output(["ls","-al"])

if __name__ == "__main__":
    app.run()