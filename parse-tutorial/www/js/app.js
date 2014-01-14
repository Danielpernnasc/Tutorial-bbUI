  		Parse.initialize("LUJcWvuLzi7Y7tqeKjAdFirU62jh8JCvMRcdW4Vc", "kP75lRJcItwAIwy1O9r3eofBuWuJez2fZTJJ9DE2");
			//Parse.initialize("APPLICATION_ID","JAVASCRIPT_KEY")
        	var Tasks;
        	var listOfTasks;
        	var inputTask;
        	
        	//função para inicializar nosso app
        	function initApp(){
        		Tasks = Parse.Object.extend("Tasks");
        		//showTasks busca tarefas já cadastradas em nosso app
        		showTasks();
        		//Adicionamos um lister para o nosso form
        		document.getElementById("form-task").addEventListener("submit",onSubmit);
        		
        		//Fazemos um cache dos itens que acessamos mais de uma vez em nosso app
        		listOfTasks = document.getElementById("list-tasks");
        		inputTask = document.getElementById("tarefa")
        	}
        	
        	//função resposável por consultar os dados na nuvem
        	function showTasks(){
        		//chamamos a função Query do Parse parar varer a nossa base
        		var query = new Parse.Query("Tasks");
        		
        		//a função trata a query para sucesso ou erro de nossa consulta
        		query.find({
        		success:function(results){
        			//esse bloco será executado se ocorrer tudo bem com nossa query
        			var markupList = "";
        			//os resultados vem em um array de objetos
        			//varremos o nosso array e montamos um markup
        			for(var id in results){
        				console.log("success",results[id].attributes.descricao);
        				markupList += "<li class='item-task topcoat-list__item' data-id='"+results[id].id+"' data-done='"+ results[id].attributes.done +"'>"+ results[id].attributes.descricao +"</li>"
        			}
        			listOfTasks.innerHTML = markupList;
        		},
        		error:function(error){
        			//tratamento para caso de erro
        			console.log("error",error)
        		}
        		})
        		console.log(query);
        	}
        	
        	//função para fazer o trantamento quando o usuário envia os dados do form
        	function onSubmit(e){
				var task = {};
				
				//pegamos o valor cadastrado em nosso input
				task.descricao = inputTask.value;
				task.done = "false";
				
				//passamos o nosso objeto para ser salvo na cloud
				saveTask(task);
				// utiliza o preventDefault para evitar do form realizar o reload da página
				e.preventDefault();
			}
        	
        	
        	//função específica para salvar as tasks na nuvem
        	function saveTask(task){
        	 	var taskCloud = new Tasks();
        	 	taskCloud.save(task).then(function(object) {
                  alert("Task salva com sucesso!");
                  showTasks();
                  inputTask.value = "";
            	});
        	}
        	
        	window.addEventListener("load", initApp)