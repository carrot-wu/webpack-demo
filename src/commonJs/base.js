const _console = ({ data = 'hello',msg = 'world',dataObj = { text:'123',txt:'456'} } = {}) => {

    let testObj = Object.assign(dataObj,{noMsg:'hhhhhhh',yesMsg:'nnnnnnn'})
    let {
        text,
        txt,
        noMsg,
        yesMsg
    } = dataObj;

    function myPromise(data){
        return new Promise( (resolve,reject) => {

            if(data === 'test'){
                resolve(data)
            }else{
                reject(data)
            }
        })
    }

    let currentTem = ``
    currentTem = ` 你好 ${data} ${msg} ${text} ${txt} ${yesMsg} ${noMsg}`
    return currentTem
};

const creatElement = ({ele = 'div',id = 'test',innerHtml = 'no msg'} = {}) => {
    const box = document.getElementById('box')
     let dataEle  = document.createElement(ele);
     dataEle.innerHtml = innerHtml;
     dataEle.setAttribute('id',id);
     box.innerHtml = dataEle
     console.log(dataEle)
}

export  {_console,creatElement}