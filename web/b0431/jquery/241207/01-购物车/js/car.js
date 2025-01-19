$(function(){
  $(".checkall").change(function(){
  $(".checkall,.j-checkbox").prop("checked",$(this).prop("checked"))
  if($(this).prop("checked")){
    $(".cart-item").prop("class","cart-item check-cart-item")

  }else{
    $(".cart-item").prop("class","cart-item")

  }
})
$(".j-checkbox").change(function(){
  if($(".j-checkbox:checked").length==$(".j-checkbox").length){
    $(".checkall").prop("checked",true)
  }else{
    $(".checkall").prop("checked",false)

  }

 if($(this).prop("checked")) {
  $(this).parent().parent().prop("class","cart-item check-cart-item")
 }else{
  $(this).parent().parent().prop("class","cart-item")

 }
 jiesuan()
})

$(".increment").click(function(){
  var nowvalue =$(this).siblings("input").prop("value")
  nowvalue++
  $(this).siblings("input").prop("value",nowvalue)
  var nowprice=$(this).parents().siblings(".p-price").text()
  nowprice=nowprice.substr(1)
  $(this).parents().siblings(".p-sum").text("￥"+(nowprice*nowvalue).toFixed(2))
  jiesuan()
})

$(".decrement").click(function(){
  var nowvalue =$(this).siblings("input").prop("value")
  nowvalue--
  if(nowvalue<0){
    nowvalue==0
    var nowprice=$(this).parents().siblings(".p-price").text()
    nowprice=nowprice.substr(1)
    $(this).parents().siblings(".p-sum").text("￥"+0)

  }else{
  $(this).siblings("input").prop("value",nowvalue)
  var nowprice=$(this).parents().siblings(".p-price").text()
  nowprice=nowprice.substr(1)
  $(this).parents().siblings(".p-sum").text("￥"+(nowprice*nowvalue).toFixed(2))
}
jiesuan()
})
$(".itxt").change(function(){
  var nowval=$(this).val()
  var nowprice=$(this).parents().siblings(".p-price").text()
  nowprice=nowprice.substr(1)
  $(this).parents().siblings(".p-sum").text("￥"+(nowval*nowprice))
  jiesuan()
})


function jiesuan() {
  var psum = $(".p-sum").text().split('￥').slice(1); // 总价
  var sum = 0;
  var counts = 0;//个数
  var countArray = [];
  var checkArray=[]
  $(".j-checkbox").each(function(){
    checkArray.push($(this).prop("checked"))
  })
  console.log(checkArray);
  $.each(psum, function (i, e) {
    if(checkArray[i])
      {
       sum += parseFloat(psum[i]);
    }
     
  });

  
  $('.itxt').each(function(i,e) {
    if(checkArray[i])
    {
      countArray.push($(this).val());
      countArray[i]=parseFloat(countArray[i])
      counts+=countArray[i]
    }
      
  });
  
  var allcount=$(".amount-sum").text()
  $(".amount-sum").find("em").text(counts);
  var allsum=$(".price-sum").text().substr(1)
  $(".price-sum").find("em").text("￥"+sum)


}
 $(".p-action ").click(function(){
  $(this).parent(".cart-item").remove()
 })
 $(".clear-all ").click(function(){
  $(this).parents(".cart-floatbar").siblings(".cart-item-list").remove()
 })

 $(".remove-batch ").click(function(){
  var checkArray=[]
  $(".j-checkbox").each(function(i,e){
    checkArray.push($(this).prop("checked"))
    if(checkArray[i])
    {
      $(this).parents(".cart-item").remove()
    }

  })
  
  
   
  
 })

})