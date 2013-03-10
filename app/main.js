(function(){
	window.FT = window.FT  || {};
	FT.Models = {};
	FT.Collections = {};
	FT.Views = {};
	/**
		Transaction Model
	**/
	FT.Models.Transaction = Backbone.Model.extend({
		defaults: {
			type: 'Expense',
			amount: 50,
			description: 'I spent at bar',
			category: 'Drink'
		},
		validate: function(attrs){
			if( ! $.trim(attrs.amount)){
				return 'A Transaction requires a valid amount';
			}
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
			"<table border=1><tr><th>Type of Transaction</th><th>Amount</th><th>Description</th><th>Category</tr>"+
			"<br /><div id='add-view'>"),
		initialize: function(){
			this.collection.on("add", this.addOne, this);
			this.$el.html(this.template());
			var addTransactionView = new FT.Views.AddTransaction({collection: this.collection});
			this.$('#add-view').append(addTransactionView.render().el);
		},
		render: function(){
			var that= this;
			this.$el.find('.transaction-model-view').remove();
			this.collection.each(this.addOne, this);
			return this;
		},
		addOne: function(transaction){
			var transactionView = new FT.Views.Transaction({model: transaction});
			this.$el.find('tbody').append(transactionView.render().el);
		}
	});
	/**
	Transaction View
	**/
	FT.Views.Transaction = Backbone.View.extend({
		className:'transaction-model-view',
		tagName: 'tr',
		template: _.template("<td><%=type%></td><td><%=amount%></td><td><%=description%></td><td><%=category %></td>"+
			"<td><button id='edit'>Edit</button></td><td><button id='delete'>Delete</button></td>"),
		initialize: function(){
			this.model.on('change', this.render, this);
			this.model.on('destroy', this.removeView, this);
		},
		events:{
			'click #delete' : 'remove',
			'click #edit': 'editTransaction'
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		editTransaction: function(){
			var newTransaction = prompt("Amount: ", this.model.get('amount'));
			if(!newTransaction) return;
			this.model.set('amount', newTransaction);
		},
		remove: function(){
			this.model.destroy();
		},
		removeView: function(){
			this.$el.remove();
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
			"<button>Save</button></form>"),
		events: {
			'submit': 'submit'
		},
		render:function(){
			this.$el.html(this.template());
			return this;
		},
		submit: function(e){
			e.preventDefault();
			//get values from template
			var type = this.$('#type').val(),
				description = this.$('#description').val(),
				amount = this.$('#amount').val(),
				category = this.$('#category').val();
			//save it to the collection3
			var newTransaction = new FT.Models.Transaction({
				'type': type,
				'description': description,
				'amount': amount,
				'category': category
			});
			this.collection.add(newTransaction);
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
			$('body').html(transactionsView.render().el);
		}
	});
	new FT.Router
	Backbone.history.start();
})();