const SCI_FUNCS = ['sin(', 'cos(', 'tan(', 'asin(', 'acos(', 'atan(', 'log(', 'log10(', 'sqrt(', 'exp(', 'pi', 'e'];

export function initScientific(insertToken){
    const root = document.getElementById('sciButtons');
    if(!root) return;
    root.innerHTML = '';

    SCI_FUNCS.forEach(token => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'key';
        btn.textContent = token.replace('(', '');
        btn.addEventListener('click', ()=>{
            insertToken && insertToken(token);
        });
        root.appendChild(btn);
    });
}
