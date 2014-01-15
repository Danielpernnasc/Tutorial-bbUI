Parse.initialize("APPLICATION_ID","JAVASCRIPT_KEY")

 var app = {
	 		Tasks:null,
        	listOfTasks:null,
        	inputTask:null,
	 
	 		//função para inicializar nosso app
        	initApp: function(){
        		app.Tasks = Parse.Object.extend("Tasks");
        		
				//showTasks busca tarefas já cadastradas em nosso app
        		app.showTasks();
        		
				//Adicionamos um lister para o nosso form
        		document.getElementById("form-task").addEventListener("submit",app.onSubmit);
        		
        		//Fazemos um cache dos itens que acessamos mais de uma vez em nosso app
        		app.listOfTasks = document.getElementById("list-tasks");
        		app.inputTask = document.getElementById("tarefa");
				
				//vamos adicionar o clique na ul, pq inicialmente não temos os li's
        		app.listOfTasks.addEventListener("click",app.clickList);
        	},
	 
	 		//função resposável por consultar os dados na nuvem
        	showTasks: function(){
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
							markupList += "<li class='item-task' data-id='"+results[id].id+"' data-done='"+ results[id].attributes.done +"'>"+ results[id].attributes.descricao +"<button class='btn-remove' data-id='"+results[id].id+"'>Remover</button></li>";
						}
						app.listOfTasks.innerHTML = markupList;
					},
					error:function(error){
						//tratamento para caso de erro
						console.log("error",error)
					}
        		})
        	},
				
			// função para modificar o status da task
			clickList: function(e){
				if(e.target.localName == "li"){
					e.target.dataset.done = (e.target.dataset.done === 'true')? false : true;
					app.editTask(e.target.dataset.id,e.target.dataset.done);
				}else if(e.target.localName == "button"){
					e.target.disabled = "disabled";
					e.target.innerHTML = "Removendo..."
					app.removeTask(e.target.dataset.id);
				}
			},

			//função para fazer o trantamento quando o usuário envia os dados do form
        	onSubmit: function(e){
				var task = {};
				
				//pegamos o valor cadastrado em nosso input
				task.descricao = app.inputTask.value;
				task.done = "false";
				
				//passamos o nosso objeto para ser salvo na cloud
				app.saveTask(task);
				// utiliza o preventDefault para evitar do form realizar o reload da página
				e.preventDefault();
			},


        	//função específica para salvar as tasks na nuvem
        	saveTask: function (task){
        	 	var taskCloud = new app.Tasks();
        	 	taskCloud.save(task).then(function(object) {
                  console.log("Task salva com sucesso!");
                  app.showTasks();
                  app.inputTask.value = "";
            	});
        	},
	 		
	 		//função para editar um item salvo na cloud
	 		editTask: function (id,done){
				var query = new Parse.Query(app.Tasks);
				query.get(id, {
				  success: function(task) {
					 task.set("done", done);
					 task.save()
				  },
				  error: function(object, error) {
					console.log("erro ao salvar o objeto", object, error)
				  }
				});
			},
	 		removeTask:function(id){
				var query = new Parse.Query(app.Tasks);
				query.get(id, {
				  success: function(task) {
					 task.destroy({
					 	success:function(task){
							app.showTasks();
						}
					 })
				  }
				});
			}
 }
 			
window.addEventListener("load", app.initApp)