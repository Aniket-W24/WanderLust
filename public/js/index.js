let taxSwitch = document.getElementById("flexSwitchCheckDefault");
taxSwitch.addEventListener("click", ()=> {
    let taxInfo = document.getElementsByClassName("tax-info");
    for(info of taxInfo){

        if(info.style.display != "inline"){
            info.style.display = "inline"
        } else {
            info.style.display = "none"
        }
        
    }
})

// let Trending = document.getElementsByClassName("filter-btn");
// for(trend of Trending){
//     trend.addEventListener("click", ()=> {
//         console.log(trend);
//     })
// }
// Trending.addEventListener("click", ()=> {
//     console.log(Trending);
//     // for(trend of Trending){
//     //     console.log()
//     // }
// })

let filterBtns = document.getElementsByClassName("filter-btn");

for (let btn of filterBtns) {
    btn.addEventListener("click", ((btn) => {
        return () => {
            console.log(btn);
            let redirectUrl = `/listings/findByGenre?value=${btn.value}`;   //redirecting to url with given query
            window.location.href = redirectUrl;
        };
    })(btn));
}

