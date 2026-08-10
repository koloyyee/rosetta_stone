///usr/bin/env jbang "$0" "$@" ; exit $?

import com.sun.net.httpserver.Filter;
import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpHandlers;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.Request;
import com.sun.net.httpserver.SimpleFileServer;
import java.io.IOException;
import static java.lang.System.*;

import java.net.InetSocketAddress;
import java.nio.file.Path;
import java.util.function.Predicate;

/// Quick learning of Simple Server
/// to run some test
/// 
/// use 
/// `curl "http://localhost:8080/test"`
/// and 
/// `curl "http://localhost:8080/test/allowed"`
public class SimpleServer {

    static final InetSocketAddress address = new InetSocketAddress(8080);
    static final int port = 8080;
    static final Path pwd = Path.of(System.getProperty("user.dir"));

    public static void main(String... args) throws IOException {
        /// First part we will use the SimpleFileServer
        /// Then we will use the HttpServer.
        /// Just comment one of them and see it runs,
        /// the handlers are shared between the servers.
        
        // simpleServer();
        httpServer();
        
    }

    static HttpHandler testHandler() {
        return SimpleFileServer.createFileHandler(Path.of("/Users"));
    }

    static HttpHandler helloOrDenyHandler() {
        var helloResp = HttpHandlers.of(200, Headers.of("Allow", "GET"), "Hello!~");
        var denyResp = HttpHandlers.of(401, Headers.of("Deny", "GET"), "Denied");
        Predicate<Request> findAllowedPath = r -> r.getRequestURI().getPath().equals("/test/allowed");
        return HttpHandlers.handleOrElse(findAllowedPath, helloResp, denyResp);
    }

    static Filter filterReq() {
        return SimpleFileServer.createOutputFilter(out, SimpleFileServer.OutputLevel.INFO);
    }

    /// A simple file server from Java 18
    /// notice it doesn't print out the filters.
    static void simpleServer() {
        // 0. basic setup
        var server = SimpleFileServer.createFileServer(address, pwd, SimpleFileServer.OutputLevel.INFO);

        // handlers
        // 1. just testing hello
        // server.createContext("/test", testHandler());
        // 2. handleOrElse func
        server.createContext("/test", helloOrDenyHandler());

        server.start();
        out.println("Simple File Server Running on port: " + port);
        out.println("pwd: " + pwd);
    }

    /// HttpServer a very simple one.
    /// We can see the filtered information.
    static void httpServer() {

        try {
            // 3. addign filter setup
            var server = HttpServer.create(address, 10, "/test", helloOrDenyHandler(), filterReq());

            server.start();
            out.println("Http Server Running on port: " + port);
            out.println("pwd: " + pwd);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
