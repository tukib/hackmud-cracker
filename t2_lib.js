function(context, args)
{
	const N = #fs.beta.acct_nt_lib()

	var amounts = {"secret":7,"beast":666,"elite":1337,"hunter":3006,"magician":1089,"monolithic":2001,"meaning":42,"secure":443,"special":38}

	return {
		"CON_SPEC": function(state) {
			if (/scriptor/.test(state.output)) {
				state.solution = "scriptor"
			} else if (/^[A-Z]{4,7}$/.test(state.output)) {
				if (state.solution["CON_SPEC"] != "scriptor") return "Error: Rotation"
				var a = state.output.slice(-3).split("").map(a => a.charCodeAt(0))
				var b = a[1] - a[0]
				var c = a[2] - a[0]
				state.solution["CON_SPEC"] = String.fromCharCode(a[2] + b, a[2] + c, a[2] + b + c)
			} else {
				return "Error: Unknown"
			}
		},
		"sn_w_glock": function(state) {
			if (!/balance/.test(state.output)) return "Error: Unknown"
			for (var amount in amounts) {
				if (new RegExp(amount).test(state.output)) {
					state.solution["sn_w_glock"] = amounts[amount]
					break
				}
			}
		},
		"acct_nt": function(state) {
			state.acct_nt.output = N.parseOutput(state.output)
			if (!state.acct_nt.output) return "Error: Unknown"
			if (!state.acct_nt.solutions) {
				state.acct_nt.type = state.acct_nt.output.type
				state.acct_nt.solutions = N.findSolutions(state)
				state.acct_nt.solutions = N.updateSolutions(state)
			}
			state.acct_nt.solutions = N.removeSolutions(state).filter(a => a.amount != state.solution["acct_nt"])
			if (state.acct_nt.solutions.length < 1) {
				delete state.acct_nt.solutions
				delete state.solution["acct_nt"]
			}
		},
		"magnara": function(state) {
			if (!/recinroct magnara ulotnois orf/.test(state.output)) return "Error: Unknown"
			if (state.magnara.solved) return "Error: Rotation"
			var anagram = /recinroct magnara ulotnois orf: ([a-z]{4,9})/.exec(state.output)[1]
			if (!state.magnara.solutions) {
				var solutions = (#db.f({_id:`magnara_${anagram.split("").sort().join("")}`}).first() || {}).solution
				if (!solutions) {
					var solutions = #fs.ast.magnara_solver({scramble:anagram})
					if (!solutions) {
						#db.u1({_id:"anagrams"},{$addToSet:{anagrams:anagram}})
						return `Error: magnara - Could not solve anagram "${anagram}" - Solve manually using magnara:["solutions"]`
					}
				}
				state.magnara.solutions = solutions
			}
			if (state.magnara.solutions.length < 1) {
				#db.r({_id:`magnara_${anagram.split("").sort().join("")}`})
				delete state.magnara.solutions
				delete state.solution["magnara"]
				return `Error: magnara - Could not solve anagram "${anagram}" - Solve manually using magnara:["solutions"]`
			}
			state.solution["magnara"] = state.magnara.solutions.shift()
		},
		"l0ckbox": function(state) {
			if (!/please load the appropriate k3y/.test(state.output)) return "Error: Unknown"
			var k3y = /please load the appropriate k3y: ([a-z0-9]{6})/.exec(state.output)[1]
			state.solution["l0ckbox"] = k3y
			var k3ys = #hs.sys.upgrades({full:true}).filter(a => a.k3y == k3y)
			if (k3ys.length > 0) {
				var manage = #ms.sys.manage({load:k3ys[0].i})
				if (manage.ok === false) return `Error: sys.manage - ${manage.msg}`
			} else {
				return `Error: l0ckbox - Could not load k3y "${k3y}"`
			}
		}
	}
}
