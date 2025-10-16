from flask import Flask, request, jsonify, render_template
import socket
from plot_position_changes import plot_position_changes_base64

# serve templates from webtemp and static from ./static
app = Flask(__name__, template_folder='webtemp', static_folder='static')

@app.route("/")
def index():
    return render_template("f1.html")

@app.route("/run", methods=["POST"])
def run_plot():
    data = request.get_json() or {}
    round_num = data.get("round")
    year = data.get("year", 2025)
    if round_num is None:
        return jsonify({"error": "missing round"}), 400
    try:
        b64img = plot_position_changes_base64(int(year), int(round_num))
        return jsonify({"plot": b64img})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    host = "0.0.0.0"
    port = 5000

    # try to determine local network IP for convenience
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
    except Exception:
        local_ip = "127.0.0.1"

    print("Starting Flask development server")
    print(f"Local: http://127.0.0.1:{port}/")
    print(f"On network: http://{local_ip}:{port}/")
    app.run(host=host, port=port, debug=True)
