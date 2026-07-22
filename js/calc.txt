const API_BASE = 'http://127.0.0.1:5000';

export function initCalc(onUpdated, getSettings = ()=>({precision:4,notation:'normal',grouping:false})){ 
    const display = document.getElementById('display');
    const keypad = document.getElementById('keypad');
    if(!display || !keypad) return;
    let expr = '';

    function updateDisplay(){
        display.textContent = expr || '0';
    }

    function hasBalancedParens(value){
        let depth = 0;
        for(const char of value){
            if(char === '(') depth += 1;
            else if(char === ')'){
                depth -= 1;
                if(depth < 0) return false;
            }
        }
        return depth === 0;
    }

    async function calculate(){
        if(!expr.trim()){
            display.textContent = '0';
            return;
        }
        if(!hasBalancedParens(expr)){
            display.textContent = 'Unmatched parentheses';
            return;
        }

        try{
            const sendExpr = expr.replace(/\^/g, '**');
            let resp = await fetch(`${API_BASE}/api/calc`, {
                method: 'POST', headers: {'Content-Type':'application/json'},
                body: JSON.stringify({expr: sendExpr})
            });
            let text = await resp.text();
            if(resp.status === 405){
                console.warn('POST /api/calc returned 405, retrying with GET');
                resp = await fetch(`${API_BASE}/api/calc?expr=${encodeURIComponent(sendExpr)}`, {
                    method: 'GET', headers: {'Content-Type': 'application/json'}
                });
                text = await resp.text();
            }
            console.debug('Calc response status', resp.status, text);
            let data = {};
            try {
                data = JSON.parse(text);
            } catch(parseErr) {
                const message = `Invalid server response (${resp.status}): ${text.slice(0, 200)}`;
                console.error('Calculation parse error:', parseErr, text);
                throw new Error(message);
            }
            if(resp.ok){
                if(typeof data.result === 'undefined'){
                    throw new Error(`Missing result in response: ${JSON.stringify(data)}`);
                }
                const settings = getSettings();
                const formatted = formatResult(data.result, settings);
                expr = String(data.result);
                display.textContent = formatted;
                onUpdated && onUpdated();
            } else {
                const message = data.error || `Error ${resp.status}: ${text.slice(0, 200)}`;
                console.error('Calculation error:', message, data);
                display.textContent = message;
                expr = '';
            }
        } catch(err){
            console.error('Calculation request failed:', err);
            display.textContent = err.message || 'Error';
            expr = '';
        }
    }

    function formatResult(value, settings){
        if(typeof value !== 'number') return String(value);
        const precision = Math.max(0, Math.min(12, settings.precision || 4));
        if(settings.notation === 'scientific'){
            return Number(value).toExponential(precision);
        }
        let formatted = Number(value).toFixed(precision);
        if(settings.grouping){
            const [integer, fraction] = formatted.split('.');
            formatted = Number(integer).toLocaleString('en-US');
            if(fraction !== undefined) formatted += `.${fraction}`;
        }
        return formatted;
    }

    keypad.addEventListener('click', async (e)=>{
        const clicked = e.target.nodeType === Node.TEXT_NODE ? e.target.parentElement : e.target;
        const keyEl = clicked && clicked.closest ? clicked.closest('.key') : null;
        if(!keyEl || !keypad.contains(keyEl)) return;
        const v = keyEl.textContent.trim();
        if(v === '='){
            await calculate();
            return;
        }
        if(v === 'C') { expr=''; updateDisplay(); return; }
        expr += v;
        updateDisplay();
    });

    function insertToken(token){
        expr += token;
        updateDisplay();
    }

    return { insertToken };
}
