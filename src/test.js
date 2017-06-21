var name = "vodka"
var request = require('request');
request('http://www.thecocktaildb.com/api/json/v1/1/search.php?s='+name, function (error, response, body) {
    if (!error) {
        console.log("ok");
        var object = JSON.parse(body)
        var drinks = object.drinks
        for (var i in drinks) {
            var drink = drinks[i];
            console.log(drink.strDrink)
            var instruction = drink.strInstructions
            console.log("\t"+instruction);
            var i = 1;
            while (i < 16 && drink["strIngredient" + i] != "") {
                console.log("\t"+"Ingredient: " + drink["strIngredient" + i])
                if (drink["strMeasure" + i] != "" && drink["strMeasure" + i] != "\n") {
                    console.log("\t"+"Measure: " + drink["strMeasure" + i])
                }
                i++;
            }
        }
    } else {
        console.log("error");
        console.log(error.code);
    }
});
