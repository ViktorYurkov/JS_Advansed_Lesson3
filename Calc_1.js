class Line {
    constructor(data, type, priority) {
        this.data = data;
        this.type = type;
        this.priority = priority;
    }
};

let i = 0; // індекс елементу масиву введення
let lineDisplay = []; //масив обєктів введення
let arhiv = [];
let charThis = ''; // поточний символ
let charOfGrupeEnd = 'first'; // попередій символ якої групи кнопок калькулятора
let charOfGrupeThis = undefined; //поточний символ якої групи кнопок калькулятора
let scobaOpen = 0; //кількість відкриваючих скобок і не закритих
let errorData = true; //чи помилкове значення
//let strTablo = ''; //строка дисплея калькулятора
let indexChar = undefined; //позиція символу в допустимих словах
let leterAll = true; //true - повністю набрана операція
let priority = 0;

const calc = { // обєкт калькулятор

    //при клацані мишкою
    mouseClick: function (char) {

        const rulesMouse = [ //масив допустимих стрічок
    ['1', 'number', -100], ['2', 'number', -100], ['3', 'number', -100], ['4', 'number', -100], ['5', 'number', -100], ['6', 'number', -100], ['7', 'number', -100], ['8', 'number', -100], ['9', 'number', -100], ['0', 'number', -100], ['00', 'number', -100], ['.', 'point', -100], [',', 'point', -100], ['+', 'sub1', 1], ['-', 'sub1', 1], ['*', 'sub1', 2], ['/', 'sub1', 2], ['(', 'scoba(', 3], [')', 'scoba)', -1], ['^', 'sub1', 2], ['c', 'clear'], ['sqr', 'sub2', 10], ['cos', 'sub2', 10], ['sin', 'sub2', 10], ['=', 'result'], ['Backspace', 'clear'], ['Enter', 'result']

]
        errorData = true;
        indexChar = 0; //
        leterAll = true;
        charThis = char;

        calc.operation(rulesMouse);
    },

    // метод до натискання клавіш
    keyboardPres: function () {

        const rulesKeyboard = [ //масив допустимих стрічок
        ['1', 'number', -100], ['2', 'number', -100], ['3', 'number', -100], ['4', 'number', -100],
        ['5', 'number', -100], ['6', 'number', -100], ['7', 'number', -100], ['8', 'number', -100],
        ['9', 'number', -100], ['0', 'number', -100], ['00', 'number', -100], ['.', 'point', -100],
        [',', 'point', -100], ['+', 'sub1', 1], ['-', 'sub0', 1], ['*', 'sub1', 2], ['/', 'sub1', 2],
        ['(', 'scoba(', 3], [')', 'scoba)', -1], ['^', 'sub1', 2], ['sqr', 'sub2k', 10],
        ['cos', 'sub2k', 10], ['sin', 'sub2k', 10], ['=', 'result'], ['Backspace', 'clear'],
        ['Enter', 'result'], ['Delete', 'clear']
        ]
        errorData = true;
        charThis = event.key;

        calc.operation(rulesKeyboard);
    },

    // операції 
    operation: function (rulesSymbol) {
        //перевірка введеного символу на допуск 
        calc.rulesChar(rulesSymbol);
        // операції з введеними даними ( видалення , результату )
        switch (charOfGrupeThis) {
            case 'clear': {
                calc.delChar();
                return;
            }
            case 'result': {
                calc.result();
                return;
            }
            default: {
                if (!errorData) {
                    errorData = true;
                    // перевірка правила слідування елементів 
                    calc.rulesFind();
                };
                if (errorData) {
                    calc.getMessage(window.event.clientX, window.event.clientY);
                }
            }
        }
    },

    //rulesChar: function () {
    rulesChar: function (rulesSymbol) {

        let char = leterAll ? charThis : lineDisplay[i].data + charThis;
        rulesSymbol.some(function (elem, ind) {
            indexChar = elem[0].indexOf(char);
            if (indexChar !== -1) {
                (elem[0] === char) ? leterAll = true: leterAll = false;
                
                if (indexChar === 0) {
                    charOfGrupeThis = rulesSymbol[ind][1];
                    priority = rulesSymbol[ind][2];
                    errorData = false; //////////////
                    return true;
                }
            }
        });
    },

    //пошук правилу для додавання символу
    rulesFind: function () {
        const rules = [ // масив допустимих послідовностей
        ['first+number', 1],
        ['first+sub0', 5],
        ['first+scoba(', 1],
        ['first+scoba(', 1],
        ['first+sub2', 1],
        ['first+sub2k', 1],
        ['number+number', 2],
        ['number+sub1', 3],
        ['number+sub0', 3],
        ['number+scoba)', 3],
        ['number+point', 2],
        ['point+number', 2],
        ['sub1+number', 3],
        ['sub0+number', 3],
        ['sub1+scoba(', 3],
        ['sub0+scoba(', 3],
        ['sub1+sub2', 3],
        ['sub1+sub2k', 3],
        ['sub0+sub2', 3],
        ['sub0+sub2k', 3],
        ['scoba)+scoba)', 3],
        ['scoba)+sub1', 3],
        ['scoba)+sub0', 3],
        ['sub2+scoba(', 3],
        ['scoba(+number', 3],
        ['scoba(+sub0', 5],
        ['scoba(+scoba(', 3],
        ['scoba(+sub2', 3],
        ['scoba(+sub2k', 3],
        ['sub2+sub2', 3],
        ['sub2k+sub2k', 4]
    ];
        rules.find(function (elem, ind) {
            if (elem[0] === (charOfGrupeEnd + '+' + charOfGrupeThis) && errorData) {
                if (!calc.permissionGetScoba()) {
                    return;
                }
                calc.addChar(elem[1]);
                errorData = false;
            }
        });
    },

    // додавання символу в масив і екран
    addChar: function (metod) {
        switch (metod) {
            case 1: {
                $('#tablo')[0].value = charThis;
                lineDisplay[i] = new Line(charThis, charOfGrupeThis, priority);
                charOfGrupeEnd = charOfGrupeThis;
                break
            }
            case 2: {
                $('#tablo')[0].value += charThis;
                lineDisplay[i].data = lineDisplay[i].data + charThis;
                charOfGrupeEnd = charOfGrupeThis;
                break
            }
            case 3: {
                $('#tablo')[0].value += charThis;
                i++;
                lineDisplay[i] = new Line(charThis, charOfGrupeThis, priority);
                charOfGrupeEnd = charOfGrupeThis;
                break
            }
            case 4: {
                $('#tablo')[0].value += charThis;
                lineDisplay[i].data = lineDisplay[i].data + charThis;
                console.log('leterAll   ' + leterAll)
                charOfGrupeEnd = (leterAll) ? 'sub2' : charOfGrupeThis;
                break
            }
            case 5: {
                $('#tablo')[0].value += charThis;
                i++;
                lineDisplay[i] = new Line(charThis, charOfGrupeThis, priority);
                charOfGrupeEnd = 'number';
                break
            }
        }
    },

    // видалення символу з масиву і екрану
    delChar: function () {
        errorData = false;
        let strTablo = $('#tablo')[0].value; //строка дисплея калькулятора
        $('#tablo')[0].value = strTablo.slice(0, strTablo.length - 1);

        if (lineDisplay.length !== 0) {
            if (lineDisplay[i].data.length > 1) {
                lineDisplay[i].data = lineDisplay[i].data.slice(0, lineDisplay[i].data.length - 1);
                console.log(lineDisplay);
                console.log(lineDisplay.length);
            } else {
                lineDisplay.pop();
                //lineDisplay[i].data = '';
                //lineDisplay[i].type = ''
                console.log(lineDisplay.length);
                if (lineDisplay.length === 0) {
                    charOfGrupeEnd = 'first';
                } else {
                    i--;
                    charOfGrupeEnd = lineDisplay[i].type;
                    console.log(charOfGrupeEnd + ' ' + lineDisplay[i].type);
                }
            }
        }
    },

    // облік скобок і дозвіл на проставлення
    permissionGetScoba: function () {
        switch (charOfGrupeThis) {
            case 'scoba(': {
                scobaOpen++;
                break
            }
            case 'scoba)': {
                if (scobaOpen === 0) {
                    return false;
                } else {
                    scobaOpen--;
                };
                break
            }
        }
        return true;
    },

    ////////////////////////////////////кнопка результату  "=" , "ОК"
    result: function () {
        errorData = false;
        let j = 0;
        let itog = [];
        let priorityThis = 0;
        let kol = arhiv.length;
        arhiv[kol] = '';

        lineDisplay.forEach(function (elem, ind) {
            arhiv[kol] += elem.data;
        });

        //видалення скобок і залишиння операцій reduce
        while (j <= lineDisplay.length - 1) {
            if (lineDisplay[j].priority === 3) {
                priorityThis += 10;
                lineDisplay.splice(j, 1);
            } else if (lineDisplay[j].priority === -1) {
                priorityThis -= 10;
                lineDisplay.splice(j, 1);
            } else {
                lineDisplay[j].priority = lineDisplay[j].priority + priorityThis;
                j++;
            }
        }

        let pozition = 0;
        let s = 0;
        let max = 0;

        //операції

        let n = 0;
        while (n = lineDisplay.length - 1) {
            max = 0;
            pozition = 0;
            lineDisplay.forEach(function (elem, ind) {

                if (max < elem.priority) {
                    max = elem.priority;
                    pozition = ind;
                }
            });
            
            switch (lineDisplay[pozition].data) {

                case '+': {
                    lineDisplay[pozition - 1].data = +lineDisplay[pozition - 1].data + +lineDisplay[pozition + 1].data;
                    lineDisplay.splice(pozition, 2);
                    break

                }
                case '-': {
                    lineDisplay[pozition - 1].data = +lineDisplay[pozition - 1].data - +lineDisplay[pozition + 1].data;
                    lineDisplay.splice(pozition, 2);
                    break
                }
                case '/': {
                    lineDisplay[pozition - 1].data = +lineDisplay[pozition - 1].data / +lineDisplay[pozition + 1].data;
                    lineDisplay.splice(pozition, 2);
                    break
                }
                case '*': {
                    lineDisplay[pozition - 1].data = +lineDisplay[pozition - 1].data * +lineDisplay[pozition + 1].data;
                    lineDisplay.splice(pozition, 2);
                    break
                }
                case '^': {
                    lineDisplay[pozition - 1].data = Math.pow(+lineDisplay[pozition - 1].data, +lineDisplay[pozition + 1].data);
                    lineDisplay.splice(pozition, 2);
                    break;
                }
                case 'sin': {
                    lineDisplay[pozition + 1].data = Math.sin(+lineDisplay[pozition + 1].data);
                    lineDisplay.splice(pozition, 1);
                    break;
                }
                case 'cos': {
                    lineDisplay[pozition + 1].data = Math.cos(+lineDisplay[pozition + 1].data);
                    lineDisplay.splice(pozition, 1);
                    break;
                }
                case 'sqr': {
                    lineDisplay[pozition + 1].data = Math.sqrt(+lineDisplay[pozition + 1].data);
                    lineDisplay.splice(pozition, 1);
                    break;
                }
            }
        }
        arhiv[kol] = arhiv[kol] + ' = ' + lineDisplay[0].data;

        $('#tablo')[0].value = lineDisplay[0].data;
        lineDisplay[0].type = 'number'
        i = 0;
    },

    history: function (i) {
        if (i <= arhiv.length && i >= 0){
            $('#tablo')[0].value = '';
            $('#tablo')[0].setAttribute('placeholder', arhiv[i]);
        }      
    },
    // повідомлення невірного введення
    getMessage: function (x, y) {
        $('#info').css('top', y);
        $('#info').css('left', x);
        $('#info').css('width', 250);
        //console.log($('#info'));
        $('#info')[0].innerHTML = 'невірно натиснута клавіша';
        setTimeout(function () {
            $('#info')[0].innerHTML = '';
            $('#info').css('width', 0);
        }, 1000)
        errorData = false;
    }
}

$(function () {
    let q = arhiv.length;
    $('body').on('keyup', function () {
        $('#tablo')[0].setAttribute('placeholder', '');
        calc.keyboardPres();
        q = arhiv.length;
    });

    $('button').on('click', function () {
        q --;
        calc.history(q);
    });

    $('li').on('click', function () {
        $('#tablo')[0].setAttribute('placeholder', '');
        calc.mouseClick($(this)[0].innerText);
        q = arhiv.length;
    });

});
