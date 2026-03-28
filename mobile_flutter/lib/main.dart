import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Set immersive status bar
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.light,
    systemNavigationBarColor: Color(0xFF080C1F),
    systemNavigationBarIconBrightness: Brightness.light,
  ));

  runApp(const NyayaMitraApp());
}

class NyayaMitraApp extends StatelessWidget {
  const NyayaMitraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'NyayaMitra',
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF080C1F),
        useMaterial3: true,
      ),
      home: const MainWebView(),
    );
  }
}

class MainWebView extends StatefulWidget {
  const MainWebView({super.key});

  @override
  State<MainWebView> createState() => _MainWebViewState();
}

class _MainWebViewState extends State<MainWebView> {
  late final WebViewController _controller;
  bool _isLoading = true;
  double _progress = 0;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFF080C1F))
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (int progress) {
            setState(() {
              _progress = progress / 100;
            });
          },
          onPageStarted: (String url) {
            setState(() {
              _isLoading = true;
            });
          },
          onPageFinished: (String url) {
            setState(() {
              _isLoading = false;
            });
          },
          onWebResourceError: (WebResourceError error) {
            debugPrint("WebView Error: ${error.description}");
          },
        ),
      )
      // Point to local dev server (10.0.2.2 is localhost for Android Emulator)
      // Change this to your Netlify URL for live app
      ..loadRequest(Uri.parse('https://nyayamitra.netlify.app'));
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        if (await _controller.canGoBack()) {
          _controller.goBack();
          return false;
        }
        return true;
      },
      child: Scaffold(
        body: SafeArea(
          child: Stack(
            children: [
              WebViewWidget(controller: _controller),
              if (_isLoading)
                Align(
                  alignment: Alignment.topCenter,
                  child: LinearProgressIndicator(
                    value: _progress,
                    backgroundColor: Colors.transparent,
                    color: const Color(0xFFFF9933),
                    minHeight: 2,
                  ),
                ),
              if (_isLoading && _progress < 0.1)
                Container(
                  color: const Color(0xFF080C1F),
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainValueAlignment.center,
                      children: [
                        Image.network(
                          'https://raw.githubusercontent.com/shreeK05/NyayaMitra/main/frontend/public/logo192.png',
                          width: 80,
                          errorBuilder: (_, __, ___) => const Icon(Icons.gavel, color: Color(0xFFFF9933), size: 60),
                        ),
                        const SizedBox(height: 24),
                        const CircularProgressIndicator(
                          valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFFF9933)),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
