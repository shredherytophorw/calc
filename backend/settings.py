from flask import Blueprint, jsonify

bp = Blueprint('settings', __name__)

@bp.route('/settings')
def settings():
    return jsonify({'message': 'Settings API placeholder'})
