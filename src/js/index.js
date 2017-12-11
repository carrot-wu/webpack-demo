
import '../css/index.css'
console.log('index')
//$('#box').html('这是index页面的文件jq')

$('img').on('click',function(){
	console.log(2)
})
const test = [1,2,3,4,5,6,7,8]

test.includes(2)

if (module.hot) {
    module.hot.accept()
}