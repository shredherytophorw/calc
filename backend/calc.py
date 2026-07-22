from flask import Blueprint, request, jsonify
import ast
import math
from .storage import add_history

bp = Blueprint('calc', __name__)

ALLOWED_FUNCS = {name: getattr(math, name) for name in dir(math) if not name.startswith('_')}
ALLOWED_NAMES = {'pi': math.pi, 'e': math.e}

def safe_eval(expr: str):
    node = ast.parse(expr, mode='eval')
    for n in ast.walk(node):
        if isinstance(n, ast.Call):
            if not isinstance(n.func, ast.Name) or n.func.id not in ALLOWED_FUNCS:
                raise ValueError(f"Function '{getattr(n.func, 'id', '?')}' not allowed")
        elif isinstance(n, ast.Name):
            if n.id not in ALLOWED_FUNCS and n.id not in ALLOWED_NAMES:
                raise ValueError(f"Name '{n.id}' not allowed")
        elif isinstance(n, (ast.BinOp, ast.UnaryOp, ast.Expression, ast.Load, ast.Constant, ast.operator, ast.unaryop, ast.Expr)):
            continue
        else:
            raise ValueError(f"Disallowed expression element: {type(n).__name__}")

    compiled = compile(node, '<string>', 'eval')
    env = {}
    env.update(ALLOWED_FUNCS)
    env.update(ALLOWED_NAMES)
    return eval(compiled, {'__builtins__': {}}, env)


@bp.route('/calc', methods=['GET', 'POST', 'OPTIONS'])
def calc():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.status_code = 200
        return response

    if request.method == 'GET':
        expr = request.args.get('expr', '').strip()
    else:
        data = request.get_json() or {}
        expr = data.get('expr', '').strip()

    if not expr:
        return jsonify({'error': 'No expression provided'}), 400
    try:
        result = safe_eval(expr)
        entry = f"{expr} = {result}"
        add_history(entry)
        return jsonify({'result': result, 'entry': entry})
    except Exception as e:
        return jsonify({'error': str(e)}), 400
