function(context, args)
{
	return {
		"sortUpgrades": function(upgrades) {
			upgrades.sort((a,b) => a.tier-b.tier || a.rarity-b.rarity || a.name.localeCompare(b.name))
			return upgrades
		},
		"getHash": function(state) {
			var upgrade = state.upgrades[0]
			state.test = {}
			state.test.upgrade = upgrade
			var salt = state.sn_w_usac.salt || ""
			var str = `${upgrade.name}${upgrade.tier}${upgrade.rarity}${upgrade.sn}${upgrade.i}${salt}`.toLowerCase()
			var output = [0,0,0,0,0,0,0]
			var codes = ["_".charCodeAt(0), "0".charCodeAt(0), "a".charCodeAt(0)]
			for (var i = 0; i < str.length; i++) {
				var c = str.charCodeAt(i)
				if (c === codes[0]) output[0]++
				var check = c - codes[1]
				if (check < 10 && check >= 0) output[check % 7]++
				check = c - codes[2]
				if (check < 26 && check >= 0) output[check % 7]++
			}
			for (var i = 0; i < 13; i++) {
				output[i] = output[i] % 6 + codes[2]
			}
			return String.fromCharCode(output[0],output[1],output[2],output[3],output[4],output[5],output[6])
		},
		"getSalt": function(state) {
			var unsalted = state.solution["sn_w_usac"]
			var salted = state.output
			var salt = ""
			var a = "abcdef"
			for (var i = 0; i < 7; i++) {
				salt += i.toString().repeat((6 + a.indexOf(salted[i]) - a.indexOf(unsalted[i])) % 6)
			}
			return salt
		}
	}
}
