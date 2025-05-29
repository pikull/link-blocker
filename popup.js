var array = [];

document.getElementById("add").addEventListener("click",function(){
    let value = document.getElementById("site").value;
    if (value == "" || value == null || array.includes(value)){return}
    let text = document.createElement("p")
    text.innerHTML = value;

    array.push(value)
    let div = document.createElement("div");

    let but = document.createElement("button");
    but.innerHTML = "x";
    but.addEventListener("click",function(){
        let textremove = text.innerHTML;
        let index = array.indexOf(textremove);
        if (index > -1) {
            array.splice(index, 1);
        }
        div.remove()
    })
    div.className = "wrapper";
    div.appendChild(text)
    div.appendChild(but)
    document.body.appendChild(div);
})

document.getElementById("update").addEventListener("click", function(){
    alert(array.toString());
})
