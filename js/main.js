const basicStats = ["str","dex","con","int","wis","chr"]

const lvl_prop = [
    [2, 300],
    [2, 900],
    [2, 2700],
    [2, 6500],
    [3, 14000],
    [3, 23000],
    [3, 34000],
    [3, 48000],
    [4, 64000],
    [4, 85000],
    [4, 100000],
    [4, 120000],
    [5, 140000],
    [5, 165000],
    [5, 195000],
    [5, 225000],
    [6, 265000],
    [6, 305000],
    [6, 355000],
    [6, 'MAX']
]

const classProp = {
    brb: [12, 7],   // Barbarian
    brd: [8, 5],    // Bard
    clr: [8, 5],    // Cleric
    drd: [8, 5],    // Druid
    fgt: [10, 6],   // Fighter
    mnk: [8, 5],    // Monk
    pld: [10, 6],   // Paladin
    rng: [10, 6],   // Ranger
    rou: [8, 5],    // Rogue
    src: [6, 4],    // Sorcerer
    wrl: [8, 5],    // Warlock
    wiz: [6, 4]     // Wizard
}

var divHolder = document.createElement('div')
var closeHolder = document.get

function countMaxHP(classId){
    var baseHP = classProp[classId][0] 
    var incrHP = classProp[classId][1]
    var cur_lvl = parseInt(document.getElementById('char_lvl').textContent)
    var con_bonus = parseInt(document.getElementById('con_bonus').textContent)
    var hpSpan = document.getElementById('healtText')
    
    var maxHP = baseHP + cur_lvl *(incrHP + con_bonus) - incrHP
    hpSpan.textContent = hpSpan.textContent.replace(/\/.*$/, "/" + maxHP)
    setHP(false,true)
}

function countProf(){
    var statSpan = document.getElementById('prof_bonus');
    var lvl = parseInt(document.getElementById('char_lvl').textContent);
    var bonus = "+" + lvl_prop[lvl-1][0];
    statSpan.textContent = bonus;
    updateValues()
}

function countBonus(element){
    var stat = document.getElementById(element.dataset.parent).value;
    var bonus = Math.floor((stat - 10) / 2);
    var id = element.id.split("_");
    if (document.getElementById(id[0]).checked == true){
        bonus += parseInt(document.getElementById('prof_bonus').textContent);
    }
    var bonusText = bonus >= 0 ? `+${bonus}` : bonus;
    element.textContent = bonusText;
    if (element.id == 'dex_bonus'){
        document.getElementById('init_bonus').textContent = bonusText;
    }
}

function updateValues() {
    var toValidate = document.getElementsByClassName("base-stats-field");
    Array.from(toValidate).forEach(elmt => validateBaseStat(elmt));

    var toUpdate = document.getElementsByClassName("bonus-span");
    Array.from(toUpdate).forEach(elmt => countBonus(elmt));

    countMaxHP(document.getElementById('char_class').value)
}

function saveToJSON() {
    //get data to export
    //to do exp, other stats, class, race, bg
    var export_content = {};
    export_content.char_name = document.getElementById('char_name').value;
    basicStats.forEach(id => export_content[id] = document.getElementById(id).value);
    
    //export data do json
    const jsonString = JSON.stringify(export_content, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = export_content.char_name + "_save.json";
    a.click();
    URL.revokeObjectURL(url);
    alert('funkcjonalność nie skończona... Prace trwają...')
}

function loadJSON(){
    alert('Prace trwają...')
}

function addXP(){
    var lvl_span = document.getElementById('char_lvl');
    var prg_txt = document.getElementById('progressText');
    var xp_input = document.getElementById('exp_increment');
    var xp_inc = parseInt(xp_input.value);
    var cur_lvl = parseInt(lvl_span.textContent);
    var cur_xp = parseInt(prg_txt.textContent.split('/')[0]);
    var max_xp = lvl_prop[cur_lvl-1][1];
    cur_xp += xp_inc;
    if (cur_xp >= max_xp){
        while (cur_xp >= max_xp){
            max_xp = lvl_prop[cur_lvl][1];
            cur_lvl += 1;
        }
        lvl_span.textContent = cur_lvl;
        countProf();
    }
    setBarWidth('progressBar', cur_xp, max_xp);
    prg_txt.textContent = cur_xp + "/" + max_xp;
    xp_input.value = max_xp-cur_xp;
}

function setBarWidth(id,cur,max){
    var element = document.getElementById(id)
    var proc = String(cur*100 / max) +"%";
    element.style.width = proc;
}

function validateBaseStat(element){
    var stat = element.value;
    if (stat>20){
        element.value = 20;
    } else if (stat<0){
        element.value = 0;
    }     
}

function setHP(bool,max = false){
    var hpSpan = document.getElementById('healtText')
    var cur_hp = parseInt(hpSpan.textContent.split("/")[0])
    var max_hp = parseInt(hpSpan.textContent.split("/")[1])
    var hpInput = document.getElementById('hp-input')
    var hpValue = hpInput.value
    if (max == true){
        if (bool == true){
            hpValue = max_hp
        }else{
            hpValue = 0
        }
    }
    else if (bool==false){
        hpValue = -hpValue
    }
    cur_hp += Number(hpValue)

    if (cur_hp <= -max_hp){
        alert("umarłeś")
    }
    else if(cur_hp <=0){
        handleDeath()
    }
    else if(cur_hp > max_hp){
        cur_hp = max_hp
    }
    if (bool != false || max != true){
        hpSpan.textContent=hpSpan.textContent.replace(/^[^\/]*/, cur_hp )
    }
    hpInput.value = "1"
    setBarWidth('healtBar', cur_hp, max_hp)

}

function handleDeath(){
    var oldDiv = document.getElementById('healtDiv')
    divHolder = oldDiv
    const newDiv = document.createElement('div');
    newDiv.className = 'subcontainer';
    newDiv.id = 'deathDiv';
    newDiv.innerHTML = `
        <div class="subercontainer">
            <span>YOU ARE UNCONSCIOUS</span>
        </div>
        <div class="subercontainer">
            <span class=deathDivSpan>SUCCESSES: </span>
            <div class="death_circle death_s" id="death_s1"></div>
            <div class="death_circle death_s" id="death_s2"></div>
            <div class="death_circle death_s" id="death_s3"></div>
        </div>
        <div class="subercontainer">
            <span class=deathDivSpan> FAILURES: </span>
            <div class="death_circle death_f" id="death_f1"></div>
            <div class="death_circle death_f" id="death_f2"></div>
            <div class="death_circle death_f" id="death_f3"></div>
        </div>
        <div class="subercontainer">
            <button onclick="death_throw('death_s', 'green')">Success</button>
            <button onclick="death_throw('death_f', 'red')">Failure</button>
            <button onclick="resurrection()">Revival</button>
        </div>
    `;
    oldDiv.parentNode.replaceChild(newDiv, oldDiv)
}

function resurrection(){
    var oldDiv = document.getElementById('deathDiv')
    oldDiv.parentNode.replaceChild(divHolder, oldDiv)
    var hpSpan = document.getElementById('healtText')
    hpSpan.textContent = hpSpan.textContent.replace(/^[^\/]*/,"1")
    setHP(false,true)
}

function death_throw(class_name, color){
    var circles = document.getElementsByClassName(class_name);
    for (let i = 0; i < circles.length; i++) {
        if (circles[i].style.backgroundColor == "") {
            circles[i].style.backgroundColor = color
            if(i<2){
                return;
            }
        }
    }
    if(color == 'green'){
        resurrection()
    }else{
        alert('UMARŁEŚ :(')
    }
}

function showPopup(id){
    var popup = document.getElementById(id)
    popup.style.display = "block"
    alert('Prace trwają...')
}

function hidePopup(id){
    var popup = document.getElementById(id)
    popup.style.display = "none"
}