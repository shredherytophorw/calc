const API_BASE = 'http://127.0.0.1:5000';

export function initHistory(){
    const listEl = document.getElementById('historyList');
    async function refresh(){
        try{
            const resp = await fetch(`${API_BASE}/api/history`);
            const data = await resp.json();
            if(listEl) listEl.textContent = (data.history || []).join('\n') || 'No history yet.';
        }catch(err){ if(listEl) listEl.textContent = 'Error loading history'; }
    }
    refresh();
    return { refresh };
}
