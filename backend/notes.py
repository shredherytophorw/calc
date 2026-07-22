from flask import Blueprint, request, jsonify
from .storage import get_notes, set_notes

bp = Blueprint('notes', __name__)

@bp.route('/notes', methods=['GET', 'POST'])
def notes():
    if request.method == 'GET':
        return jsonify({'notes': get_notes()})
    data = request.get_json() or {}
    set_notes(data.get('notes', ''))
    return jsonify({'ok': True})
