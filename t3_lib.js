function(context, args)
{
	const U = #fs.beta.sn_w_usac_lib()
	const W = #ls.beta.l0g_wr1t3r_lib()

	return {
		"sn_w_usac": function (state) {
			if (!/^[a-f]{7}$/.test(state.output)) return "Error: Unknown"
			if (!state.sn_w_usac.salt) state.sn_w_usac.salt = U.getSalt(state)
			else return "Error: Rotation"
		},
		"shfflr": function (state) {
			if (/not|enough/.test(state.output)) return "Error: shfflr - Not enough upgrades"
			if (!/^[+-]+ -?[0-9]+(?:\.[0-9]+)?$/.test(state.output)) return "Error: Unknown"
			#ms.beta.shfflr()
		},
		"l0g_wr1t3r": function (state) {
			if (/upgrade for script is not loaded/.test(state.output)) return "Error: l0g_wr1t3r - No log_writer off cooldown"
			else if (/is not a breached system/.test(state.output)) {
				var target = /([a-z0-9_]{1,25}\.[a-z0-9_]{1,25}) is not a breached system/.exec(state.output)[1]
				return `Error: l0g_wr1t3r - ${target} is not a breached system`
			}
			else if (/pr0vid3 0rd3red h4sh 4rray 2 c0nt1nue/.test(state.output)) {
				var target = /pr0vid3 0rd3red h4sh 4rray 2 c0nt1nue -- \d ([a-z0-9_]{1,25}\.[a-z0-9_]{1,25})/.exec(state.output)[1]
				state.balance = #hs.accts.balance()
				if (state.balance > 50000) {
					var xfer = #ms.accts.xfer_gc_to({to:state.dump_target, amount:state.balance - 50000})
					if (xfer.ok === false) return `Error: accts.xfer_gc_to - ${xfer.msg}`
				}
				if (state.balance < 50000) {
					var xfer = #fs.scriptkiddie.xfer({amount:50000 - state.balance})
					if (xfer.ok === false) return `Error: accts.xfer_gc_to_caller - ${xfer.msg}`
				}
				var reload = W.reloadUpgrade(state.upgrades, "expose_access_log")
				if (reload) return reload
				var hash = W.getHash(target)
				if (typeof hash == "string") return hash
				state.solution["l0g_wr1t3r"][hash.index] = hash.hash
			} else {
				return "Error: Unknown"
			}
		},
		"l0ckjaw": function (state) {
			if (!/l0ckjaw/.test(state.output)) return "Error: Unknown"
			return "Error: l0ckjaw - hec, no can pec"
		}
	}
}
