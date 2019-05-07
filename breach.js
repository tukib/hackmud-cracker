function (c,a) {
	const L = #fs.scripts.lib()
  const T1 = #fs.beta.t1_lib()
  const T2 = #ms.beta.t2_lib()
	const T3 = #ls.beta.t3_lib()
	const T4 = #fs.beta.t4_lib()
	const N = #fs.beta.acct_nt_lib()
	const U = #fs.beta.sn_w_usac_lib()
	const W = #ls.beta.l0g_wr1t3r_lib()

	function setBalance(amount) {
		state.balance = #hs.accts.balance()
		if (state.balance > amount) {
			var xfer = #ms.accts.xfer_gc_to({to:state.dump_target, amount:state.balance - amount})
			if (xfer.ok === false) {
				setState()
				throw new Error(`Error: accts.xfer_gc_to - ${xfer.msg}`)
			}
		}
		if (state.balance < amount) {
			var xfer = #fs.scriptkiddie.xfer({amount:amount - state.balance})
			if (xfer.ok === false) {
				setState()
				throw new Error(`Error: accts.xfer_gc_to_caller - ${xfer.msg}`)
			}
		}
	}
	function getUpgrades() {
		var upgrades = #hs.sys.upgrades({full:true})
		if (upgrades.ok === false) {
			setState()
			throw new Error(`Error: sys.upgrades - ${upgrades.msg}`)
		}
		if (typeof upgrades == "string") {
			return []
		}
		return upgrades
	}
	function getUsnax(upgrades) {
		if (upgrades.length < 1) {
			throw new Error("Error: sn_w_usac - No upgrades")
		}
		var usnax = upgrades.filter(a => a.rarity == 0 && a.name < "k3y_v1" && a.tier == 1 && a.type != "glam")
		if (usnax.length < 1) {
			setState()
			throw new Error("Error: sn_w_usac - No usnacks")
		}
		return upgrades
	}
	function getKeys(upgrades) {
		if (upgrades.length < 1) {
			throw new Error("Error: l0ckjaw - No upgrades")
		}
		var k3ys = upgrades.filter(a => a.k3y == state.solution["l0ckjaw"])
		if (k3ys.length <= 1) {
			setState()
			throw new Error("Error: l0ckjaw - No k3ys")
		}
		return upgrades
	}

  function setGetters() {
		function getter(lock) {
      if (!state.solved.includes(lock)) state.solved.push(lock)
      if (!state.solution[lock]) state.solution[lock] = solution[lock]
      return state.solution[lock]
    }
    function getter_CON_SPEC() {
			if (!state.solved.includes("CON_SPEC")) state.solved.push("CON_SPEC")
      if (!state.solution["CON_SPEC"]) state.solution["CON_SPEC"] = "scriptor"
			if (state.solution["CON_SPEC"] == "scriptor") return {call:a => a.s.split(a.d).length - 1}
      return state.solution["CON_SPEC"]
    }
		function getter_sn_w_glock() {
			if (!state.solved.includes("sn_w_glock")) state.solved.push("sn_w_glock")
			if (!state.solution["sn_w_glock"]) state.solution["sn_w_glock"] = 7
			setBalance(state.solution["sn_w_glock"])
			return state.solution["sn_w_glock"]
		}
		function getter_acct_nt() {
			if (!state.acct_nt) state.acct_nt = {}
			if (!state.solved.includes("acct_nt")) state.solved.push("acct_nt")
			if (!state.solution["acct_nt"]) state.solution["acct_nt"] = 0
			state.transactions = #hs.accts.transactions({count:30})
			if (state.acct_nt.solutions) {
				state.acct_nt.solutions = N.updateSolutions(state, a.npc)
				state.solution["acct_nt"] = state.acct_nt.solutions[0].amount
			}
			return state.solution["acct_nt"]
		}
		function getter_magnara() {
			if (!state.magnara) state.magnara = {}
			if (!state.solved.includes("magnara")) state.solved.push("magnara")
			if (!state.solution["magnara"]) state.solution["magnara"] = ""
			return state.solution["magnara"]
		}
		function getter_sn_w_usac() {
			if (!state.solved.includes("sn_w_usac")) state.solved.push("sn_w_usac")
			if (!state.sn_w_usac) state.sn_w_usac = {}
			state.upgrades = getUsnax(U.sortUpgrades(getUpgrades()))
			state.solution["sn_w_usac"] = U.getHash(state)
			return state.solution["sn_w_usac"]
		}
		function getter_l0g_wr1t3r() {
			if (!state.solved.includes("l0g_wr1t3r")) state.solved.push("l0g_wr1t3r")
			if (!state.solution["l0g_wr1t3r"]) state.solution["l0g_wr1t3r"] = []
			if (Object.keys(state.solution).pop() == "l0g_wr1t3r") {
				setBalance(500000)
				state.upgrades = getUpgrades()
				W.reloadUpgrade(state.upgrades, "log_writer")
			}
			return state.solution["l0g_wr1t3r"]
		}
		function getter_l0ckjaw() {
			if (!state.l0ckjaw) state.l0ckjaw = {}
			if (!state.solved.includes("l0ckjaw")) state.solved.push("l0ckjaw")
			if (!state.solution["l0ckjaw"]) {
				state.upgrades = getUpgrades()
				if (!state.l0ckjaw.upgrades) {
					state.l0ckjaw.upgrades = state.upgrades
					state.solution["l0ckjaw"] = ""
				} else {
					var k3ys = state.l0ckjaw.upgrades.filter(a => a.k3y && !state.upgrades.find(b => b.sn == a.sn))
					if (k3ys.length > 0) {
						var k3y = k3ys[0].k3y
						if (!a.npc) #ls.ast.alch({k3y:k3y})
						state.solution["l0ckjaw"] = k3y
					}
					state.l0ckjaw.upgrades = state.upgrades
				}
			} else {
				state.upgrades = getKeys(getUpgrades())
			}
		}

		var getters = {}
		var solution = {EZ_21:"unlock",EZ_35:"unlock",digit:0,EZ_40:"unlock",ez_prime:2,c001:"red",color_digit:3,c002:"red",c002_complement:"green",c003:"red",c003_triad_1:"cyan",c003_triad_2:"lime",l0cket:"vc2c7q",l0ckbox:"",shfflr:""}//,CON_A5V4H:{x:{f:0,p:0,a:0},y:{f:0,p:0,a:0}}}
    for (let lock in solution) {
      Object.defineProperty(getters, lock, {get: () => getter(lock)})
    }
		Object.defineProperty(getters, "CON_SPEC", {get: getter_CON_SPEC})
		Object.defineProperty(getters, "sn_w_glock", {get: getter_sn_w_glock})
		Object.defineProperty(getters, "acct_nt", {get: getter_acct_nt})
		Object.defineProperty(getters, "magnara", {get: getter_magnara})
		Object.defineProperty(getters, "sn_w_usac", {get: getter_sn_w_usac})
		Object.defineProperty(getters, "l0g_wr1t3r", {get: getter_l0g_wr1t3r})
		Object.defineProperty(getters, "l0ckjaw", {get: getter_l0ckjaw})
		return getters
  }
  function setHandlers() {
		var handlers = {}
    handlers.EZ_21 = T1.EZ_21
    handlers.EZ_35 = T1.EZ_35
		handlers.digit = T1.digit
    handlers.EZ_40 = T1.EZ_40
		handlers.ez_prime = T1.ez_prime
    handlers.c001 = T1.c001
		handlers.color_digit = T1.color_digit
    handlers.c002 = T1.c002
		handlers.c002_complement = T1.c002_complement
    handlers.c003 = T1.c003
		handlers.c003_triad_1 = T1.c003_triad_1
		handlers.c003_triad_2 = T1.c003_triad_2
    handlers.l0cket = T1.l0cket
    handlers.CON_SPEC = T2.CON_SPEC
    handlers.sn_w_glock = T2.sn_w_glock
    handlers.acct_nt = T2.acct_nt
    handlers.magnara = T2.magnara
    handlers.l0ckbox = T2.l0ckbox
		handlers.sn_w_usac = T3.sn_w_usac
		handlers.shfflr = T3.shfflr
		handlers.l0g_wr1t3r = T3.l0g_wr1t3r
		handlers.l0ckjaw = T3.l0ckjaw
		handlers.CON_A5V4H = T4.CON_A5V4H
		return handlers
  }
  function getState() {
    if (a.reset) #db.r({_id:`breach.${c.caller}.${a.t.name}`})
    var state = (#db.f({_id:`breach.${c.caller}.${a.t.name}`}).first() || {}).state
    if (!state) {
	    return {solution:{}}
    } else {
			state = JSON.parse(state)
      if (a.magnara && state.magnara) {
        if (Array.isArray(a.magnara)) state.magnara.solutions = a.magnara
        else state.magnara.solutions = [a.magnara]
      }
			if (a.l0g_wr1t3r) state.solution["l0g_wr1t3r"] = a.l0g_wr1t3r
      return state
    }
  }
	function callTarget() {
		if (state.solution["CON_A5V4H"]) {
			getters.CON_A5V4H = state.solution["CON_A5V4H"]
		}
		state.solved = []
		var call = a.t.call(getters)
		if (typeof call == "string") {
			call = call.split("\n")
			state.output = call.pop()
			if (/Provide the next three letters in the sequence/.test(state.output)) state.output = call.pop()
		} else if (call.msg) {
			state.output = call.msg
		} else {
			state.solved.push("CON_A5V4H")
			state.output = call
		}
		state.solving = state.solved.pop()
		if (state.solved.includes("acct_nt") && state.acct_nt.solutions) {
			state.acct_nt.solutions = state.acct_nt.solutions.filter(a => a.amount == state.solution["acct_nt"])
		}
		if (state.solved.includes("magnara") && !state.magnara.solved) {
			#db.us({_id:`magnara_${state.solution["magnara"].split("").sort().join("")}`},{$set:{solution:[state.solution["magnara"]]}})
			state.magnara.solved = true
		}
	}
	function parseOutput() {
		if (/script doesn't exist/.test(state.output)) return "Error: Nonexistent"
		if (/hardline required/.test(state.output)) return "Error: Hardline"
		if (/Denied access by/.test(state.output)) return "Error: Unhandled"
		if (/Connection terminated/.test(state.output)) return "Breached"
		if (/is currently breached/.test(state.output)) return "Error: Breached"
	}
	function setState(result) {
		if (/Breached|Rotation/.test(result)) #db.r({_id:`breach.${c.caller}.${a.t.name}`})
		else #db.us({_id:`breach.${c.caller}.${a.t.name}`},{$set:{state:JSON.stringify(state)}})
		if (!c.calling_script) {
			result += `\n\nOutput: ${state.output}\n\nSolution:`
			for (var lock in state.solution) {
				result += `\n${lock}: ${JSON.stringify(state.solution[lock])}`
			}
			result += `\n\nTime: ${Date.now() - _START}`
			return result
		} else {
			return {ok:!/Hardline|Solving|Rotation/.test(result),msg:result,output:state.output,solution:state.solution,time:Date.now() - _START}
		}
	}

  if (!#fs.ast.whitelist().ok) {
		if (#ms.chats.channels().includes("l0ck") || /l0ck/.test(c.caller)) return #ns.dpkg.xfr()
		else return {ok:false}
	}

  if (!a || (!a.t && !a.dump_target)) return #fs.dtr.man()

  if (a.dump_target) {
    #db.us({_id:`dump_target.${c.caller}`},{$set:{dump_target:a.dump_target}})
    return {ok:true,msg:"`Ndump_target` set to `V" + a.dump_target + "`"}
  }

	var getters = setGetters()
	var state = getState()
	var handlers = setHandlers()

	state.dump_target = (#db.f({_id:`dump_target.${c.caller}`}).first() || {}).dump_target
	if (!state.dump_target) return {ok:false,msg:"`Ndump_target` not set"}

	if (a.a5 && !state.CON_A5V4H) {
			state.CON_A5V4H = {}
			state.solution.CON_A5V4H = {x:{a:0,f:0,p:0},y:{a:0,f:0,p:0}}
	}

	while (L.can_continue_execution(1500)) {
		callTarget()
		var result = parseOutput() || handlers[state.solving](state)
		if (result) return setState(result)
	}
	return setState(`Solving: ${state.solving}`)
}
