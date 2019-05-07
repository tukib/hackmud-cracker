function(context, args)
{
	var commands = ["unlock","open","release"]
	var primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97]
	var colors = ["red","purple","blue","cyan","green","lime","yellow","orange"]
	var k3ys = ["vc2c7q","tvfkyq","uphlaw","cmppiq","6hh8xw","xwz7ja","sa23uw","i874y3","9p65cu","pmvr1q","ellux0","72umy0","eoq6de","fr8ibu","xfnkqe"]

	return {
		"EZ_21": function (state) {
			if (!/is not the correct unlock command/.test(state.output)) return "Error: Unknown"
			state.solution["EZ_21"] = commands[commands.indexOf(state.solution["EZ_21"]) + 1]
			if (!state.solution["EZ_21"] || Object.keys(state.solution).pop() != "EZ_21") return "Error: Rotation"
		},
		"EZ_35": function (state) {
			state.solution["EZ_35"] = commands[commands.indexOf(state.solution["EZ_35"]) + 1]
			if (!state.solution["EZ_35"] || Object.keys(state.solution).pop() != "EZ_35") return "Error: Rotation"
		},
		"digit": function (state) {
			if (!/is not the correct digit/.test(state.output)) return "Error: Unknown"
			state.solution["digit"] += 1
			if (state.solution["digit"] > 9 || Object.keys(state.solution).pop() != "digit") return "Error: Rotation"
		},
		"EZ_40": function (state) {
			state.solution["EZ_40"] = commands[commands.indexOf(state.solution["EZ_40"]) + 1]
			if (!state.solution["EZ_40"] || Object.keys(state.solution).pop() != "EZ_40") return "Error: Rotation"
		},
		"ez_prime": function (state) {
			if (!/is not the correct prime/.test(state.output)) return "Error: Unknown"
			state.solution["ez_prime"] = primes[primes.indexOf(state.solution["ez_prime"]) + 1]
			if (!state.solution["ez_prime"] || Object.keys(state.solution).pop() != "ez_prime") return "Error: Rotation"
		},
		"c001": function (state) {
			if (!/is not the correct color name/.test(state.output)) return "Error: Unknown"
			state.solution["c001"] = colors[colors.indexOf(state.solution["c001"]) + 1]
			if (!state.solution["c001"]) return "Error: Rotation"
			state.solution["color_digit"] = state.solution["c001"].length
			if (Object.keys(state.solution).pop() != "color_digit") return "Error: Rotation"
		},
		"color_digit": function (state) {
			return "Error: Unknown"
		},
		"c002": function (state) {
			if (!/is not the correct color name/.test(state.output)) return "Error: Unknown"
			state.solution["c002"] = colors[colors.indexOf(state.solution["c002"]) + 1]
			if (!state.solution["c002"]) return "Error: Rotation"
			state.solution["c002_complement"] = colors[(colors.indexOf(state.solution["c002"]) + 4) % 8]
			if (Object.keys(state.solution).pop() != "c002_complement") return "Error: Rotation"
		},
		"c002_complement": function (state) {
			return "Error: Unknown"
		},
		"c003": function (state) {
			if (!/is not the correct color name/.test(state.output)) return "Error: Unknown"
			state.solution["c003"] = colors[colors.indexOf(state.solution["c003"]) + 1]
			if (!state.solution["c003"]) return "Error: Rotation"
			state.solution["c003_triad_1"] = colors[(colors.indexOf(state.solution["c003"]) + 3) % 8]
			state.solution["c003_triad_2"] = colors[(colors.indexOf(state.solution["c003"]) + 5) % 8]
			if (Object.keys(state.solution).pop() != "c003_triad_2") return "Error: Rotation"
		},
		"c003_triad_1": function (state) {
			return "Error: Unknown"
		},
		"c003_triad_2": function (state) {
			return "Error: Unknown"
		},
		"l0cket": function (state) {
			if (!/is not the correct security k3y/.test(state.output)) return "Error: Unknown"
			state.solution["l0cket"] = k3ys[k3ys.indexOf(state.solution["l0cket"]) + 1]
			if (!state.solution["l0cket"] || Object.keys(state.solution).pop() != "l0cket") return "Error: Rotation"
		}
	}
}
