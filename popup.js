var textboxes = 0;

document.getElementById("add").addEventListener("click",function(){
    textboxes++;
    
    let input1 = document.createElement("input")
    input1.id = "input1"+textboxes
    let div = document.createElement("div");

    let but = document.createElement("button");
    but.innerHTML = "x";
    but.addEventListener("click",function(){
        div.remove()
    })
    div.className = "wrapper";

    input1.type = "text";
    input1.value = "HELLO";
    div.appendChild(input1)
    div.appendChild(but)
    document.body.appendChild(div);
})