let difficulty = 'easy'

// Get the pokemon pictures
function getPokemonImage(pokePairs) {
    let PokemonImage = []
    let selectedPokemons = []
    let minPokemonNumber = 1;
    let maxPokemonNumber = 810;
    while (selectedPokemons.length < pokePairs) {
        let randomPokemon = Math.floor(Math.random() * (maxPokemonNumber - minPokemonNumber + 1)) + minPokemonNumber;
        if (!selectedPokemons.includes(randomPokemon)) {
            selectedPokemons.push(randomPokemon)
        }
    }
    for (let i = 0; i < pokePairs; i++) {
        PokemonImage.push(` https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedPokemons[i]}.png`)
    }
    return PokemonImage
}

// Scatter the pokemons
function scatterPokemons(pokemonList) {
    let scatteredPokemons = [];
    let tempList = pokemonList.slice();
    while (tempList.length > 0) {
        let randomIndex = Math.floor(Math.random() * tempList.length);
        let removedElement = tempList.splice(randomIndex, 1)[0];
        scatteredPokemons.push(removedElement);
    }
    return scatteredPokemons;
}

// Set up the pokemons
function setUpPokemons(gameDifficulty) {
    $('#game_grid').removeClass();
    if (gameDifficulty === 'easy') {
        pokePairs = 3;
        gameTime = 100 * 1000;
    } else if (gameDifficulty === 'medium') {
        pokePairs = 6;
        $('#game_grid').addClass("medium");
        gameTime = 200 * 1000;
    } else {
        pokePairs = 12;
        $('#game_grid').addClass("hard");
        gameTime = 300 * 1000;
    }
    $('#totalPairs').text(pokePairs)
    let pokemons = getPokemonImage(pokePairs)
    pokemons = scatterPokemons(pokemons.concat(pokemons))
    let i = 1
    pokemons.forEach(pokemon => {
        $("#game_grid").append(`
        <div class="card" id="card${i}"}>
            <div class="front_face">
                <img src="${pokemon}" alt="pokemon">
            </div>
            <div class="back_face">
                <img src="lightball.png" alt="LightBall">
            </div>
        </div>`)
        i++;
    })
}

const setup = async () => {

    $("#darkTheme").click(function () {
        $("#lightTheme").removeClass("active");
        $(this).addClass("active");
        $("#game_grid").css("background-color", "hwb(205 1% 68%)");
        $(".back_face img").attr("src", "darkball.png");
    });

    $("#lightTheme").click(function () {
        $("#darkTheme").removeClass("active");
        $(this).addClass("active");
        $("#game_grid").css("background-color", "gold");
        $(".back_face img").attr("src", "lightball.png");
    });

    $("#timeInformation").hide()
    $("button.difficulty").click(function () {
        $("button.difficulty").removeClass("active");
        $(this).addClass("active");
        difficulty = $(this).attr("id")
    })
    $("button#reset").click(function () {
        clearInterval(timer);
        location.reload();
    });
    $("button#start").click(function () {
        $("#header").after(`<div id="game_grid"></div>`)
        setUpPokemons(difficulty)
        $("button#start").hide();
        $("#timeInformation").show()
        $("#totalTime").text(gameTime / 1000);
        $("#timeRemaining").text(gameTime / 1000);
        timer = setInterval(function () {
            $("#timeRemaining").text(gameTime / 1000);
            gameTime -= 1000;
            if (gameTime === 0) {
                clearInterval(timer);
                $("#game_grid").empty()
                $("#game_grid").append(`<h1>Time's Up!
                    <button onclick="location.reload()">Try Again</button>
                </h1>`);
            }
        }, 1000);;

        let firstCard = undefined;
        let secondCard = undefined;
        let pokemonCards = $(".card");
        let matchedCards = 0;
        let clicks = 0;
        $("#matchedPairs").text(matchedCards / 2)
        $("#pairsToMatch").text(pokemonCards.length / 2)
        $(".card").click(function () {
            if (firstCard && secondCard) {
                return;
            }
            if (!$(this).hasClass("flipped")) {
                $(this).toggleClass("flipped");
            }
            if (!firstCard) {
                firstCard = {};
                firstCard.img = $(this).find(".front_face img")[0];
                firstCard.cardID = $(this).attr("id");
                clicks++;
                $("#playerClicks").text(clicks);
            }
            else {
                secondCard = {};
                secondCard.img = $(this).find(".front_face img")[0];
                secondCard.cardID = $(this).attr("id");
                if (firstCard.cardID === secondCard.cardID) {
                    secondCard = undefined;
                    return;
                }
                if (firstCard.img.src === secondCard.img.src) {

                    $(`#${firstCard.cardID}`).off("click");
                    $(`#${secondCard.cardID}`).off("click");
                    $(`#${firstCard.cardID}`).addClass("done");
                    $(`#${secondCard.cardID}`).addClass("done");

                    firstCard = undefined;
                    secondCard = undefined;
                    matchedCards += 2;
                    $("#matchedPairs").text(matchedCards / 2)
                    $("#pairsToMatch").text(pokemonCards.length / 2 - matchedCards / 2)
                    if (matchedCards === pokemonCards.length) {
                        setTimeout(function () {
                            clearInterval(timer);
                            alert("Congratulations! You win! You matched all the pokemons!");
                        }, 1000);
                    }
                }
                else {
                    setTimeout(function () {
                        $(`#${firstCard.cardID}`).toggleClass("flipped");
                        $(`#${secondCard.cardID}`).toggleClass("flipped");
                        firstCard = undefined;
                        secondCard = undefined;
                    }, 1000);
                    if (clicks % 5 === 0) {
                        alert("Power up!")
                        $(".card").not(".done").toggleClass("flipped");
                        setTimeout(function () {
                            $(".card").not(".done").toggleClass("flipped");
                        }, 2000);
                    }
                }
                clicks++;
                $("#playerClicks").text(clicks);
            }
        });
    });

};

$(document).ready(setup)