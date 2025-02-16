/**
Find PI to the Nth Digit - 
Enter a number and have the program generate PI up to that many decimal places.
Keep a limit to how far the program will go.
 */

const readline = require( 'readline' ).createInterface( {
  input: process.stdin,
  output: process.stdout,
} )
const message = "Enter a number and have the program generate PI up to that many decimal places. \n" 
readline.question( message, ( nth ) => {

  if ( typeof nth !== "number"  && String(nth).includes(".")) {
    console.error( "integer only" )
    readline.close()
    return
  }
  if ( +nth > 17 || +nth < 1 ) {
    console.log( "input between 1 - 17." )
    readline.close()
    return
  }

  const PI = String( Math.PI )
  console.log( Number(PI.slice( 0, +nth + 2 )))

  readline.close()
} )

