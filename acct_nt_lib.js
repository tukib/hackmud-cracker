function (context, args) {
	const L = #fs.scripts.lib()
	return {
		parseOutput: function (output) {
			var result = /Get me the amount of a large (deposit|withdrawal) near (\d+\.\d+)/.exec(output)
			if (result) return {type:"large", depwith:result[1], start:result[2]}
			var result = /Need to know the total (spent|earned) on transactions (with|without) memos between (\d+\.\d+) and (\d+\.\d+)/.exec(output)
			if (result) return {type:"total", depwith:result[1], memo:result[2], start:result[4], end:result[3]}
			var result = /What was the net GC between (\d+\.\d+) and (\d+\.\d+)/.exec(output)
			if (result) return {type:"net", start:result[2], end:result[1]}
		},
		findSolutions: function (state) {
			var output = state.acct_nt.output
			var transactions = state.transactions
			var max = state.npc ? 9 : 24
			var startDate = new Date(2000 + output.start.substr(0,2) / 1, output.start.substr(2,2) / 1 - 1, output.start.substr(4,2) / 1, output.start.substr(7,2) / 1, output.start.substr(9,2) / 1).getTime()
			var startIndices = []
			var endIndices = []
			if (output.type == "large") {
				for (var i = 0; i < transactions.length; i++) {
					var transactionDate = new Date(transactions[i].time).getTime()
					if (startDate <= transactionDate && transactionDate < startDate + 60000) startIndices.push(i)
					endIndices.push(i)
				}
			} else {
				var endDate = new Date(2000 + output.end.substr(0,2) / 1, output.end.substr(2,2) / 1 - 1, output.end.substr(4,2) / 1, output.end.substr(7,2) / 1, output.end.substr(9,2) / 1).getTime()
				for (var i = 0; i < transactions.length; i++) {
					var transactionDate = new Date(transactions[i].time).getTime()
					if (startDate - 5000 <= transactionDate && transactionDate < startDate + 60000) startIndices.push(i)
					if (endDate <= transactionDate && transactionDate < endDate + 65000) endIndices.push(i)
				}
			}
			var solutions = []
			for (var start of startIndices) {
				for (var end of endIndices) {
					var num = end - start
					if (start <= 5 && num >= 3 && num <= max) solutions.push({start:start, end:end, num:num})
				}
			}
			return solutions
		},
		updateSolutions: function (state) {
			var type = state.acct_nt.type
			var solutions = state.acct_nt.solutions
			var transactions = state.transactions
			var min = state.npc ? 6 : 12
			switch (type) {
				case "large":
					for (var solution of solutions) {
						var target_trans = transactions[solution.start]
						for (var i = 0; i < solution.num; i++) {
							var trans = transactions[i + solution.start]
							if (target_trans.amount < trans.amount) target_trans = trans
						}
						solution.amount = target_trans.amount
						solution.depwith = "deposit"
						if (target_trans.sender == context.caller) solution.depwith = "withdrawal"
					}
					break
				case "total":
					for (var solution of solutions) {
						var is_memo = L.count(transactions, (a,b) => {return a >= solution.start && a <= solution.end && b.memo}) >= solution.num / 2
						solution.amount = 0
						for (var i = 0; i < solution.num; i++) {
							var trans = transactions[i + solution.start]
							if (!!trans.memo == is_memo) {
								if (trans.sender == context.caller) solution.amount -= trans.amount
								else solution.amount += trans.amount
							}
						}
						solution.depwith = "earned"
						if (solution.amount < 0) {
							solution.amount *= -1
							solution.depwith = "spent"
						}
						solution.memo = is_memo ? "with" : "without"
					}
					break
				case "net":
					for (var solution of solutions) {
						solution.amount = 0
						for (var i = 0; i < solution.num; i++) {
							var trans = transactions[i + solution.start]
							if (trans.sender == context.caller) solution.amount -= trans.amount
							else solution.amount += trans.amount
						}
					}
					break
			}
			var frequency = {}
			solutions.forEach((a,b) => {
				a.i = b
				if (!frequency[a.amount]) frequency[a.amount] = 0
				frequency[a.amount]++
			})
			solutions.sort((a,b) => {return frequency[b.amount] - frequency[a.amount] || Math.abs(min - a.num) - Math.abs(min - b.num) || a.i - b.i})
			return solutions
		},
		removeSolutions: function (state) {
			var output = state.acct_nt.output
			var solutions = state.acct_nt.solutions
			var transactions = state.transactions
			var startDate = new Date(2000 + output.start.substr(0,2) / 1, output.start.substr(2,2) / 1 - 1, output.start.substr(4,2) / 1, output.start.substr(7,2) / 1, output.start.substr(9,2) / 1).getTime()
			var startIndices = []
			var endIndices = []
			if (output.type == "large") {
				solutions = solutions.filter(a => {
					var transactionDate = new Date(transactions[a.start].time).getTime()
					return (startDate <= transactionDate && transactionDate < startDate + 60000)
				})
				solutions = solutions.filter(a => a.depwith == output.depwith)
			} else {
				var endDate = new Date(2000 + output.end.substr(0,2) / 1, output.end.substr(2,2) / 1 - 1, output.end.substr(4,2) / 1, output.end.substr(7,2) / 1, output.end.substr(9,2) / 1).getTime()
				solutions = solutions.filter(a => {
					var startTransactionDate = new Date(transactions[a.start].time).getTime()
					var endTransactionDate = new Date(transactions[a.end].time).getTime()
					return (startDate - 5000 <= startTransactionDate && startTransactionDate < startDate + 60000 && endDate <= endTransactionDate && endTransactionDate < endDate + 65000)
				})
				if (output.type == "total") {
					solutions = solutions.filter(a => a.depwith == output.depwith)
					solutions = solutions.filter(a => a.memo == output.memo)
				}
			}
			return solutions
		}
	}
}
