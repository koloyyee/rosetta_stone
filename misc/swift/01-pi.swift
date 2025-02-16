/**
Find PI to the Nth Digit -
Enter a number and have the program generate PI up to that many decimal places.
Keep a limit to how far the program will go.
 */

 func PIth () {
  
  print("Enter a number and have the program generate PI up to that many decimal places. \n")
  let input: String? = readLine()
  
  let nth: Int = Int(input!) ?? 0
  let PI: String = String(Double.pi)
  // let stringIndex: String.Index? = PI.firstIndex(of: ".")

  let index: String.Index = PI.index(PI.startIndex, offsetBy: nth + 2 )
  print(PI[..<index])

  
 }

 PIth()