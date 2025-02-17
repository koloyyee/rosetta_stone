// The Swift Programming Language
// https://docs.swift.org/swift-book
import Foundation

@main
struct Cmds {

	static let commands = ["cat": cat]

	static func main() {
		let args = Array(CommandLine.arguments.dropFirst())

		guard !args.isEmpty else {
			print("Usage: cmd <command> [arguments]")
			return
		}

		let command = args[0]
		if let cmd = commands[command] {
			cmd(Array(args.dropFirst()))
		}
	}
	/// Simulate cat in unix, print the content of a file.
	static func cat(_ arg: [String]) {
		// only taking the first.
		guard let filename = arg.first else {
			print("filename cannot be empty.")
			return
		}
		let manager = FileManager.default
		let currentPath = manager.currentDirectoryPath
		let filePath = ("\(currentPath)/\(filename)" as NSString).standardizingPath

		guard manager.fileExists(atPath: filePath) else {
			print("File doesn't exist.")
			return
		}

		do {
			let contents = try String(contentsOfFile: filePath, encoding: .utf8)
			print(contents)
		} catch {
			print(CmdError.readError(error))
		}
	}
}

enum CmdError: Error {
	case noFilename
	case fileNotFound(String)
	case readError(Error)
}
