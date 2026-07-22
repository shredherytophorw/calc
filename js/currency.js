import { CURRENCIES } from './currencyCountries.js';

const API_BASE = 'http://127.0.0.1:5000';

export function initCurrency(){
    const root = document.getElementById('currencyControlRoot');
    if(!root) return;
    root.innerHTML = `
        <div class="panel-split">
            <div class="panel-main">
                <div class="panel-section">
                    <div style="font-weight:600;margin-bottom:8px">Currency Converter</div>
                    <div class="small">Enter an amount and choose the base currency on the left. Then select a target currency from the list on the right.</div>
                </div>
                <div class="panel-section">
                    <div style="font-weight:600;margin-bottom:8px">Convert</div>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
                        <input id="cur-amount" type="number" value="1" placeholder="Amount" style="width:100px;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.04);background:transparent;color:inherit">
                        <select id="cur-base" style="min-width:140px;padding:8px;border-radius:8px;background:transparent;color:inherit"></select>
                        <div style="font-weight:700">→</div>
                        <div id="cur-selected" style="min-width:140px;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.04);background:rgba(255,255,255,0.02)"></div>
                        <button id="cur-refresh" style="margin-left:auto;padding:8px 14px;border-radius:8px;">Get</button>
                    </div>
                    <div id="cur-result" style="margin-top:12px;font-size:14px;color:var(--muted)"></div>
                </div>
            </div>
            <aside class="panel-sidebar">
                <div class="panel-section">
                    <div style="font-weight:600;margin-bottom:8px">Currency list</div>
                    <div id="currencyList" class="button-list"></div>
                </div>
            </aside>
        </div>
    `;

    const amountEl = root.querySelector('#cur-amount');
    const baseEl = root.querySelector('#cur-base');
    const selectedEl = root.querySelector('#cur-selected');
    const resultEl = root.querySelector('#cur-result');
    const refreshBtn = root.querySelector('#cur-refresh');
    const listEl = root.querySelector('#currencyList');

    let targetCurrency = 'EUR';

    CURRENCIES.forEach(({code, label})=>{
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'list-action';
        item.textContent = label;
        item.dataset.currency = code;
        item.addEventListener('click', ()=>{
            targetCurrency = code;
            setActiveCurrency(item);
            updateSelectedLabel();
            fetchRate();
        });
        listEl.appendChild(item);
    });

    function setActiveCurrency(activeBtn){
        Array.from(listEl.children).forEach(btn=>btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    CURRENCIES.forEach(({code, label})=>{
        const opt = document.createElement('option');
        opt.value = code;
        opt.textContent = label;
        baseEl.appendChild(opt);
    });
    baseEl.value = 'USD';
    setActiveCurrency(listEl.querySelector('[data-currency="EUR"]'));
    updateSelectedLabel();

    function updateSelectedLabel(){
        const targetLabel = CURRENCIES.find(c=>c.code === targetCurrency)?.label || targetCurrency;
        selectedEl.textContent = targetLabel;
    }

    async function fetchRate(){
        const base = baseEl.value;
        const target = targetCurrency;
        resultEl.textContent = 'Loading...';
        try{
            const q = new URLSearchParams({base, symbols:target});
            const resp = await fetch(`${API_BASE}/api/currency?${q.toString()}`);
            const data = await resp.json();
            if(resp.ok && data.rates && data.rates[target]){
                const rate = data.rates[target];
                const amount = parseFloat(amountEl.value) || 0;
                resultEl.textContent = `${amount} ${base} = ${(amount*rate).toFixed(4)} ${target} (rate ${rate.toFixed(6)})`;
            } else {
                resultEl.textContent = data.error || 'No rate available';
            }
        } catch(err){
            resultEl.textContent = 'Error fetching rates';
        }
    }

    refreshBtn.addEventListener('click', fetchRate);
    fetchRate();
}
