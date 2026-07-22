const API_BASE = 'http://127.0.0.1:5000';

export function initNotes(){
    const ta = document.getElementById('notes');
    if(!ta) return;
    async function load(){
        try{
            const resp = await fetch(`${API_BASE}/api/notes`);
            const data = await resp.json();
            ta.value = data.notes || '';
        }catch(err){ console.warn('Could not load notes'); }
    }
    ta.addEventListener('input', async ()=>{
        try{
            await fetch(`${API_BASE}/api/notes`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({notes:ta.value})});
        }catch(err){ console.warn('Could not save notes'); }
    });
    load();
}
