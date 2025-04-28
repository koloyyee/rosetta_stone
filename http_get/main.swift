import Foundation

func main() {

	Task {
		guard let url = URL(string: "https://dummyjson.com/users/1") else {
			print("Failed to get the url.")
			return
		}

		do {
			let (data, resp) = try await URLSession.shared.data(from: url)
			if let httpResponse = resp as? HTTPURLResponse {
				print("Status: \(httpResponse.statusCode)")
			}
			// if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] {
			// 	print("Body: \(json)")
			// }
			if let bodyString = String(data: data, encoding: .utf8) {
				print("Body: \(bodyString)")
			}
		} catch (let error) {
			print(error.localizedDescription)
		}
		exit(0)
	}
	RunLoop.main.run()
}
main()

// to run -> swift main.swift
