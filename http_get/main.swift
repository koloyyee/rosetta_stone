import Foundation


func main() {

	Task {
		guard let url = URL(string: "https://dummyjson.com/users/1") else {
			print("Failed to get the url.")
			return
		}

		do {
			let (data, resp) = try await URLSession.shared.data(from: url)
			print(resp);

			if let json = try JSONSerialization.jsonObject(with: data) as? [String : Any] {
				print("\(json)")
			}
		} catch (let error ){
			print(error.localizedDescription)
		}
		exit(0)
	}
	RunLoop.main.run()
}
main()

// to run -> swift main.swift