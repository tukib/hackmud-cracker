function(context, args)
{
	var lib = #fs.scripts.lib()
	return {
		"CON_A5V4H": function(state) {
			if (!state.output.t || !state.output.c || !state.output.i) return `Error: Unknown`
			if (!state.CON_A5V4H.outputs) state.CON_A5V4H.outputs = []
			state.CON_A5V4H.outputs.push(state.output)
			if (lib.can_continue_execution(2500)) state.solution["CON_A5V4H"] = JSON.parse(#fs.ast.lime({out:state.output})[0])
			state.output = "CON_A5V4H Object"
		}
	}
}
