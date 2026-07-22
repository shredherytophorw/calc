from flask import Blueprint, jsonify

bp = Blueprint('measure', __name__)

@bp.route('/measure')
def measure():
    return jsonify({'message': 'Measure API placeholder'})
