
import '../css/common.css'
import "../css/index.css";

import {myconsole} from "../baseJs/public";
// $('#box').html('这是index页面的文件jq')

$("img").on("click", function() {
    console.log(21112);
});
const test = [1, 2, 3, 4, 5, 6, 7, 8];

const _test = function(data) {
    console.log(data);
};

_test("_test");

myconsole()

test.includes(2);

if (module.hot) {
    module.hot.accept();

}
