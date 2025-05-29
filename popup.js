
document.getElementById("add").addEventListener("click",function(){
    let value = document.getElementById("site").value;
    if (value == "" || value == null){return}
    let text = document.createElement("p")
    text.innerHTML = value;
    let div = document.createElement("div");

    let but = document.createElement("button");
    but.innerHTML = "x";
    but.addEventListener("click",function(){
        div.remove()
    })
    div.className = "wrapper";
    div.appendChild(text)
    div.appendChild(but)
    document.body.appendChild(div);
})