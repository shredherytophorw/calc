const API_BASE = 'http://127.0.0.1:5000';

const MODULES = {
    length: {
        title: 'Length',
        options: [
            {from:'m', to:'km', label:'Meters → Kilometers', convert: a => a / 1000, suffix:'km'},
            {from:'m', to:'ft', label:'Meters → Feet', convert: a => a * 3.28084, suffix:'ft'},
            {from:'km', to:'mi', label:'Kilometers → Miles', convert: a => a * 0.621371, suffix:'mi'}
        ]
    },
    weight: {
        title: 'Weight',
        options: [
            {from:'kg', to:'lb', label:'Kilograms → Pounds', convert: a => a * 2.20462, suffix:'lb'},
            {from:'g', to:'oz', label:'Grams → Ounces', convert: a => a * 0.035274, suffix:'oz'},
            {from:'lb', to:'kg', label:'Pounds → Kilograms', convert: a => a * 0.453592, suffix:'kg'}
        ]
    },
    temperature: {
        title: 'Temperature',
        options: [
            {from:'C', to:'F', label:'Celsius → Fahrenheit', convert: a => (a * 9/5) + 32, suffix:'°F'},
            {from:'F', to:'C', label:'Fahrenheit → Celsius', convert: a => (a - 32) * 5/9, suffix:'°C'},
            {from:'C', to:'K', label:'Celsius → Kelvin', convert: a => a + 273.15, suffix:'K'}
        ]
    }
};

export function initMeasure(){
    const root = document.getElementById('measureControlRoot');
    if(!root) return;
    root.innerHTML = `
        <div class="panel-split">
            <div class="panel-main">
                <div class="panel-section">
                    <div style="font-weight:600;margin-bottom:8px">Measurement Converter</div>
                    <div class="small">Pick a category and conversion option on the right, then enter an amount and press Convert.</div>
                </div>
                <div class="panel-section">
                    <div style="font-weight:600;margin-bottom:8px">Convert</div>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
                        <input id="m-amount" type="number" value="1" placeholder="Amount" style="width:100px;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.04);background:transparent;color:inherit">
                        <div id="m-choice" style="min-width:180px;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.04);background:rgba(255,255,255,0.02)"></div>
                        <button id="m-go" style="margin-left:auto;padding:8px 14px;border-radius:8px;">Convert</button>
                    </div>
                    <div id="m-result" style="margin-top:12px;font-size:14px;color:var(--muted)"></div>
                </div>
            </div>
            <aside class="panel-sidebar">
                <div class="panel-section">
                    <div style="font-weight:600;margin-bottom:8px">Categories</div>
                    <div id="measureTabs" class="button-list"></div>
                </div>
                <div class="panel-section">
                    <div style="font-weight:600;margin-bottom:8px">Conversion options</div>
                    <div id="measureOptions" class="button-list"></div>
                </div>
            </aside>
        </div>
    `;

    const tabsEl = root.querySelector('#measureTabs');
    const optionsEl = root.querySelector('#measureOptions');
    const amountEl = root.querySelector('#m-amount');
    const choiceEl = root.querySelector('#m-choice');
    const resultEl = root.querySelector('#m-result');
    const goBtn = root.querySelector('#m-go');

    let activeModule = 'length';
    let activeOption = MODULES[activeModule].options[0];

    function renderTabs(){
        tabsEl.innerHTML = '';
        Object.keys(MODULES).forEach(key => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'list-action' + (key === activeModule ? ' active' : '');
            btn.textContent = MODULES[key].title;
            btn.addEventListener('click', ()=>{
                activeModule = key;
                activeOption = MODULES[key].options[0];
                renderTabs();
                renderOptions();
                renderChoice();
            });
            tabsEl.appendChild(btn);
        });
    }

    function renderOptions(){
        optionsEl.innerHTML = '';
        MODULES[activeModule].options.forEach(option => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'list-action' + (option === activeOption ? ' active' : '');
            btn.textContent = option.label;
            btn.addEventListener('click', ()=>{
                activeOption = option;
                renderOptions();
                renderChoice();
            });
            optionsEl.appendChild(btn);
        });
    }

    function renderChoice(){
        choiceEl.textContent = `${activeOption.from} → ${activeOption.to}`;
    }

    function convert(){
        const value = parseFloat(amountEl.value) || 0;
        const output = activeOption.convert(value);
        resultEl.textContent = `${value} ${activeOption.from} = ${output.toFixed(4)} ${activeOption.suffix}`;
    }

    goBtn.addEventListener('click', convert);
    renderTabs();
    renderOptions();
    renderChoice();
}
