from flask import Blueprint, jsonify, request
import urllib.request
import json

bp = Blueprint('currency', __name__)

@bp.route('/currency')
def currency():
    #oi yo nabigar hai
    base = request.args.get('base', 'USD')
    symbols = request.args.get('symbols', '')
    #you can add more logic here to handle the symbols parameter if needed
    url = f"https://open.er-api.com/v6/latest/{base}"
    try:
        with urllib.request.urlopen(url, timeout=5) as resp:
            data = json.load(resp)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 502
