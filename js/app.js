import { initCalc } from './calc.js';
import { initHistory } from './history.js';
import { initNotes } from './notes.js';
import { initCurrency } from './currency.js';
import { initMeasure } from './measure.js';
import { initScientific } from './scientific.js';
import { initSettings, appSettings } from './settings.js';

const history = initHistory();
initSettings();
const calc = initCalc(()=> history.refresh(), ()=> appSettings);
initNotes();
initCurrency();
initMeasure();
initScientific(calc?.insertToken);

const buttons = document.querySelectorAll('.nav button');
const panels = {
    'btn-calc': 'panel-calc',
    'btn-history': 'panel-history',
    'btn-notes': 'panel-notes',
    'btn-scientific': 'panel-scientific',
    'btn-settings': 'settingsPanel',
    'btn-currency': 'panel-currency-left',
    'btn-measure': 'panel-measure-left'
};
function hideLeftPanels(){
    for(const id of Object.values(panels)){
        const el = document.getElementById(id);
        if(el) el.style.display = 'none';
    }
}
buttons.forEach(b=>b.addEventListener('click', ()=>{
    buttons.forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    hideLeftPanels();
    const target = panels[b.id];
    if(target){
        const el = document.getElementById(target);
        if(el) el.style.display = 'block';
    }
    if(b.id === 'btn-history') history.refresh();
}));
