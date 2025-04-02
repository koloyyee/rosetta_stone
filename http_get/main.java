
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class main {

    public static void main(String[] args) {
        try {
            var request = HttpRequest
                    .newBuilder(new URI("https://dummyjson.com/users/1"))
										.GET()
										.build();
            var response = HttpClient
                    .newBuilder()
                    .build()
                    .send(request,
                            HttpResponse.BodyHandlers.ofString());
            System.out.println("Response: " + response.body());
            System.out.println("Status: " + response.statusCode());
        } catch (URISyntaxException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException ioe) {
            ioe.printStackTrace();
        } catch (InterruptedException ex) {
            ex.printStackTrace();

        }
    }
}
// to run -> java main.java