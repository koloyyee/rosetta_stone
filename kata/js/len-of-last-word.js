let s = "   fly me to  the moon ";

function lenOfLastWorld(s) {
	return s.trim().split(/\s+/).pop().length;
}

console.log(lenOfLastWorld(s));
