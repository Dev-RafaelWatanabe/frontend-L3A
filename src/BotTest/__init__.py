from flask import Flask, request, jsonify
from flask_cors import CORS
import pywhatkit as kt
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.route('/send-whatsapp', methods=['POST'])
def send_whatsapp():
    try:
        data = request.json
        message = data.get('message', '')
        group_id = "FIUayU1cLtBAfI7uib3pSK"  # Your WhatsApp group ID

        # Get current time + 2 minutes (pywhatkit needs future time)
        now = datetime.now()
        hour = now.hour
        minute = now.minute + 1

        # Send message
        kt.sendwhatmsg_to_group(group_id, message, hour, minute)
        
        return jsonify({
            "status": "success",
            "message": "Message sent successfully"
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)