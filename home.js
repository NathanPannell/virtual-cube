// Perform an API call with Pokemon name
function searchPokemon() {
    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            // Page found, save to browser and load main page
            localStorage.setItem("pokemon", name)
            window.location.href = "cube.html"
        } else if(this.status == 404) {
            // Page not found, display error text
            $("#error-text").text(`Pokemon "${name}" not found, please search again`)
        }
    }

    let input = $("#search-bar").val().toLowerCase().trim().split(" ")
    let whitespace = ""
    let name = ""
    for (let i = 0; i < input.length; i++) {
        name += whitespace + input[i]
        whitespace = "-"
    }
    
    xhttp.open("GET", "https://pokeapi.co/api/v2/pokemon/" + name, true)
    xhttp.send()
}

$("#search-bar").keypress(function(e) {
    if(e.key === "Enter") {
        searchPokemon()
    }
})