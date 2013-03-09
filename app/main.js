(function(){
	window.FT = window.FT  || {};
	FT.Models = {};
	FT.Collections = {};
	FT.Views = {};
	FT.Data = {}	//Transaction Data/Object
	/**
	Transaction Model
	**/
	FT.Models.Transaction = Backbone.Model.extend({
		defaults: {
			type: 'Expense',
			amount: 50,
			description: 'I spent at bar',
			category: 'Drink'
		}
	});
	/**
		Transactions Collection
	**/
	FT.Collections.Transactions = Backbone.Collection.extend({
		model: FT.Models.Transaction
	});
	/**
		Transactions Collection View
	**/
	FT.Views.Transactions = Backbone.View.extend({
		template: _.template(
			"<br /><div id='add-view'></table>"+
			"<table border=1><tr><th>Type of Transaction</th><th>Amount</th><th>Description</th><th>Category</tr>"),
		initialize: function(){
			this.collection.on("add", this.render, this);
			this.$el.html(this.template());
			var addTransactionView = new FT.Views.AddTransaction({collection: this.collection});
			this.$('#add-view').append(addTransactionView.el);
			this.render();
		},
		render: function(){
			var that= this;
			this.$el.find('.transaction-model-view').remove();
			this.collection.each(function(transaction){
				var transactionView = new FT.Views.Transaction({model: transaction});
				that.$el.find('tbody').append(transactionView.el);
			});
		}
	});
	/**
	Transaction View
	**/
	FT.Views.Transaction = Backbone.View.extend({
		className:'transaction-model-view',
		tagName: 'tr',
		template: _.template("<td><%=type%></td><td><%=amount%></td><td><%=description%></td><td><%=category %></td>"),
		initialize: function(){
			this.render();
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
		},
		error: function(model, error){
			alert(error);
		}
	});
	/**
		Add Transaction View
	**/
	FT.Views.AddTransaction = Backbone.View.extend({
		template: _.template("<form>"+"<select id='type'><option>Deposit</option><option>Expense</option></select>"+
			"<input id='description' placeholder='Description' type='text' />"+
			"<input id='amount' placeholder='Amount' type='number	' />"+
			"<select id='category'><option>Food</option><option>Drink</option><option>Entertainment</option><option>Paycheck</option></select>"+
			"<button id = 'save'>Save</button></form>"),
		initialize: function(){
			this.render();
		},
		events: {
			'click #save': 'save'
		},
		render:function(){
			this.$el.html(this.template());
		},
		save: function(e){
			e.preventDefault();
			//get values from template
			var type = this.$('#type').val(),
				description = this.$('#description').val(),
				amount = this.$('#amount').val(),
				category = this.$('#category').val();
			//save it to the collection3
			this.collection.add({
				'type': type,
				'description': description,
				'amount': amount,
				'category': category
			});
		}
	});
	/**
	Backbone Router
	**/	
	FT.Router = Backbone.Router.extend({
		routes: {
			"" : 'index'
		},
		index: function(){
			var transactionModel = new FT.Models.Transaction();	//transaction model
			var transactionsCollection = new FT.Collections.Transactions();	//transaction collection
			transactionsCollection.add(transactionModel);
			var transactionsView = new FT.Views.Transactions({collection: transactionsCollection});
			$('body').html(transactionsView.el);
		}
	});
	new FT.Router
	Backbone.history.start();
})();