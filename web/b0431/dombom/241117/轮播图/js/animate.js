
function animate(ele, target, callback) {
    clearInterval(ele.time)
    ele.time = setInterval(function () {
        var ss = (target - ele.offsetLeft) / 10
        ss = ss > 0 ? Math.ceil(ss) : Math.floor(ss)
        if (ele.offsetLeft == target) {
            clearInterval(ele.time)
            if (typeof callback == "function") {
                callback()
            }
        }
        ele.style.left = ele.offsetLeft + ss + "px"
    }, 50)
}