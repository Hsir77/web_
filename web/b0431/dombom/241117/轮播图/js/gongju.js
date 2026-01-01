function getSib(ele) {
  var eleArr = ele.parentNode.children;
  var child = [];
  for (var i = 0; i < eleArr.length; i++) {
    if (eleArr[i] != ele) {
      child.push(eleArr[i]);
    }
  }
  return child;
}
