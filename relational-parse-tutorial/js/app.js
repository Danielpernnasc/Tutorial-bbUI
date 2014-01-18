Parse.initialize("LUJcWvuLzi7Y7tqeKjAdFirU62jh8JCvMRcdW4Vc", "kP75lRJcItwAIwy1O9r3eofBuWuJez2fZTJJ9DE2");

//Parse.initialize("YOUR_APP_ID", "YOUR_JS_KEY");


var app = {
	Cars: null,
	listOfCars: null,
	inputModel: null,
	inputValue: null,
	inputYear: null,
	inputSearh: null,

	//função para inicializar nosso app
	initApp: function () {
		app.Cars = Parse.Object.extend("Cars");

		//showAllCars busca tarefas já cadastradas em nosso app
		app.showAllCars();

		//Adicionamos um lister para o nosso form
		document.getElementById("form-car").addEventListener("submit", app.onSubmit);
		document.getElementById("search-by-model").addEventListener("submit", app.onSubmitSearch);


		//Fazemos um cache dos itens que acessamos mais de uma vez em nosso app
		app.listOfCars = document.getElementById("list-cars");
		app.inputModel = document.getElementById("model-car");
		app.inputYear = document.getElementById("year-car");
		app.inputValue = document.getElementById("value-car");
		app.inputSearh = document.getElementById("model-car-searh");
	},

	//função responsável por consultar os dados na nuvem
	showAllCars: function () {
		//chamamos a função Query do Parse parar varer a nossa base
		var query = new Parse.Query("Cars");
		//a função trata a query para sucesso ou erro de nossa consulta
		query.find({
			success: function (results) {
				//esse bloco será executado se ocorrer tudo bem com nossa query
				app.updateOutputList(results)
			},
			error: function (error) {
				//tratamento para caso de erro
				console.log("error", error)
			}
		})
	},

	updateOutputList: function (results) {
		var markupList = "";
		console.log(results)
		if (results.length > 0) {
			markupList = "<tr><th>Modelo</th><th>Ano</th><th>Valor</th></tr>";

			//os resultados vem em um array de objetos
			//varremos o nosso array e montamos um markup
			for (var id in results) {
				markupList += "<tr class='item-car'>";
				markupList += "<td>" + results[id].attributes.model + "</td>";
				markupList += "<td>" + results[id].attributes.year + "</td>";
				markupList += "<td>" + results[id].attributes.value + "</td>";
				markupList +=
					"</tr>";
			}
		} else {
			markupList = "<tr><th>Nenhum Resultado Encontrado</th></tr>"
		}
		app.listOfCars.innerHTML = markupList;
	},

	//função para fazer o tratamento quando o usuário envia os dados do form
	onSubmit: function (e) {
		var car = {};

		car.model = app.inputModel.value;
		car.year = parseInt(app.inputYear.value);
		car.value = parseInt(app.inputValue.value);
		//passamos o nosso objeto para ser salvo na cloud
		app.saveCar(car);
		// utiliza o preventDefault para evitar do form realizar o reload da página
		e.preventDefault();
	},

	onSubmitSearch: function (e) {
		app.searchByModel(app.inputSearh.value);
		e.preventDefault();
	},

	//função específica para salvar as cars na nuvem
	saveCar: function (car) {
		var carCloud = new app.Cars();
		carCloud.save(car).then(function (object) {
			console.log("Carro salvo com sucesso!");
			//após a informação salva limpamos os dados dos inputs e atualizamos a lista
			app.showAllCars();
			app.inputModel.value =
				app.inputYear.value =
				app.inputValue.value = "";
		});
	},

	searchByModel: function (modelCar) {
		/*
				Meu App Já instaciou a Class Cars
				caso contrario teria que instancia-la:
				var Cars = Parse.Object.extend("Cars");
				*/
		var query = new Parse.Query(app.Cars);

		//query.notEqualTo("model", modelCar);
		//query.greaterThan("year",2000);
		//resgatamos os valores maiores que 2000
		//query.greaterThan("year",2000);
		//definimos a ordenação
		//query.ascending("year");
		//query.select("model", "year");
		query.startsWith("model","F")
		query.find({
			success: function (results) {
				app.updateOutputList(results)
			},
			error: function (error) {
				alert("Error: " + error.code + " " + error.message);
			}
		});
		
		query.count({
		  success: function(count) {
			// The count request succeeded. Show the count
			alert("Carros que começam com F: " + count);
		  },
		  error: function(error) {
			// The request failed
		  }
		});
	}
}

window.addEventListener("load", app.initApp)