import '../css/common.css'

//import '../css/style.less'

import {_console, creatElement} from '../commonJs/base.js'

function hello() {
    console.log('hello', 'world')
}

hello();
hello()
hello()
const box = document.getElementById('box');
box.innerHTML = _console({data: 'hellos'});
//console.log(_console({data: 'hellos'}), '231');
creatElement()

if (module.hot) {
    module.hot.accept()
}