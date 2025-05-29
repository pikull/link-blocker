document.getElementById("add").addEventListener("click",function(){
    alert("hi")
    let input1 = document.createElement("input")
    input1.type = "text";
    input1.value = "HELLO";
    document.body.appendChild(input1);
})