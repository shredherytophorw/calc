from flask import Blueprint, jsonify
from .storage import get_history

bp = Blueprint('history', __name__)

@bp.route('/history', methods=['GET'])
def history():
    return jsonify({'history': get_history()})
