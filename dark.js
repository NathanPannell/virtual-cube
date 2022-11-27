const body = $("body")
if(localStorage.getItem("isDark") === "true") {
    body.addClass("dark")
}

function toggleDark() {
    if(body.hasClass("dark")) {
        body.removeClass("dark")
        localStorage.setItem("isDark", "false")
    } else {
        body.addClass("dark")
        localStorage.setItem("isDark", "true")
    }
    console.log(body)
}