export const appSettings = {
    precision: 4,
    notation: 'normal',
    grouping: false
};

export function initSettings(){
    const root = document.getElementById('settingsRoot');
    if(!root) return;
    root.innerHTML = `
        <div class="panel-section">
            <div style="font-weight:600;margin-bottom:8px">Theme</div>
            <div class="button-list">
                <button id="themeLight" class="list-action">Light mode</button>
                <button id="themeDark" class="list-action active">Dark mode</button>
            </div>
        </div>
        <div class="panel-section">
            <div style="font-weight:600;margin-bottom:8px">Precision</div>
            <div class="button-list">
                <button id="precision2" class="list-action">2 decimals</button>
                <button id="precision4" class="list-action active">4 decimals</button>
                <button id="precision6" class="list-action">6 decimals</button>
            </div>
        </div>
        <div class="panel-section">
            <div style="font-weight:600;margin-bottom:8px">Number format</div>
            <div class="button-list">
                <button id="formatNormal" class="list-action active">Normal</button>
                <button id="formatScientific" class="list-action">Scientific</button>
            </div>
        </div>
        <div class="panel-section">
            <div style="font-weight:600;margin-bottom:8px">Grouping</div>
            <div class="button-list">
                <button id="groupOn" class="list-action">Group digits</button>
                <button id="groupOff" class="list-action active">No grouping</button>
            </div>
        </div>
        <div class="panel-section small">Settings are saved only for this session.</div>
    `;

    const themeLight = document.getElementById('themeLight');
    const themeDark = document.getElementById('themeDark');
    const precision2 = document.getElementById('precision2');
    const precision4 = document.getElementById('precision4');
    const precision6 = document.getElementById('precision6');
    const formatNormal = document.getElementById('formatNormal');
    const formatScientific = document.getElementById('formatScientific');
    const groupOn = document.getElementById('groupOn');
    const groupOff = document.getElementById('groupOff');

    function setActiveGroup(selected, group){
        group.forEach(btn=>btn.classList.remove('active'));
        selected.classList.add('active');
    }

    themeLight.addEventListener('click', ()=>{
        document.body.classList.add('theme-light');
        setActiveGroup(themeLight, [themeLight, themeDark]);
    });
    themeDark.addEventListener('click', ()=>{
        document.body.classList.remove('theme-light');
        setActiveGroup(themeDark, [themeLight, themeDark]);
    });
    precision2.addEventListener('click', ()=>{
        appSettings.precision = 2;
        setActiveGroup(precision2, [precision2, precision4, precision6]);
    });
    precision4.addEventListener('click', ()=>{
        appSettings.precision = 4;
        setActiveGroup(precision4, [precision2, precision4, precision6]);
    });
    precision6.addEventListener('click', ()=>{
        appSettings.precision = 6;
        setActiveGroup(precision6, [precision2, precision4, precision6]);
    });
    formatNormal.addEventListener('click', ()=>{
        appSettings.notation = 'normal';
        setActiveGroup(formatNormal, [formatNormal, formatScientific]);
    });
    formatScientific.addEventListener('click', ()=>{
        appSettings.notation = 'scientific';
        setActiveGroup(formatScientific, [formatNormal, formatScientific]);
    });
    groupOn.addEventListener('click', ()=>{
        appSettings.grouping = true;
        setActiveGroup(groupOn, [groupOn, groupOff]);
    });
    groupOff.addEventListener('click', ()=>{
        appSettings.grouping = false;
        setActiveGroup(groupOff, [groupOn, groupOff]);
    });
}
