function(context, args)
{
	return {
		"reloadUpgrade": function(upgrades, upgrade) {
			upgrades = upgrades.filter(a => new RegExp(upgrade).test(a.name) && (a.rarity > 0 || a.name >= "k3y_v1" || a.tier > 1)).sort((a,b) => a.tier - b.tier)
			var now = Date.now()
			upgrades.forEach(a => {
				if (a.last_time + a.cooldown < now) a.ready = false
				else a.ready = true
			})
			var manage = {}
			var loaded = upgrades.filter(a => !a.ready && a.loaded)
			if (loaded.length > 0) manage.unload = loaded[0].i
			var ready = upgrades.filter(a => a.ready && !a.loaded)
			if (ready.length > 0) manage.load = ready[0].i
			if (!manage.load) return `Error: l0g_wr1t3r - No ${upgrade} off cooldown`
			#ms.sys.manage(manage)
		},
		"getHash": function(target) {
			var expose = #ls.sys.expose_access_log({target:target})
			if (expose.ok === false) return `Error: sys.expose_access_log - ${expose.msg}`
			for (var i = 0; i < expose.length; i++) {
				if (new RegExp(`sys.write_log execution from ${context.caller}`).test(expose[i].msg)) {
					var msg = expose[i - 1].msg.split(" ")
					return {index:parseInt(msg[0]), hash:msg[1]}
				}
			}
			return `Error: l0g_wr1t3r - Could not find hash in ${target}'s access logs - Solve manually using l0g_wr1t3r:["codes"]`
		}
	}
}
