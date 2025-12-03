import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

void main() {
  runApp(const PortfolioApp());
}

class PortfolioApp extends StatelessWidget {
  const PortfolioApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Portfolio website',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: const Color(0xFFF0F4F8),
        fontFamily: 'Roboto',
      ),
      home: const PortfolioPage(),
    );
  }
}

class PortfolioPage extends StatefulWidget {
  const PortfolioPage({super.key});

  @override
  State<PortfolioPage> createState() => _PortfolioPageState();
}

class _PortfolioPageState extends State<PortfolioPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _messageController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  Future<void> _launchURL(String url) async {
    final Uri uri = Uri.parse(url);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Could not launch $url')),
        );
      }
    }
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      final name = _nameController.text;
      final email = _emailController.text;
      final message = _messageController.text;
      
      final subject = Uri.encodeComponent('Portfolio Contact from $name');
      final body = Uri.encodeComponent('From: $name\nEmail: $email\n\nMessage:\n$message');
      final mailtoUrl = 'mailto:schroddacat@gmail.com?subject=$subject&body=$body';
      
      _launchURL(mailtoUrl);
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Opening email client...')),
      );
      _nameController.clear();
      _emailController.clear();
      _messageController.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Container(
          constraints: const BoxConstraints(maxWidth: 1000),
          margin: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            border: Border.all(color: const Color(0xFFE0E0E0)),
            borderRadius: BorderRadius.circular(8),
          ),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _buildHeader(),
                _buildAboutSection(),
                _buildProjectsSection(),
                _buildContactSection(),
                _buildLinksSection(),
                _buildFooter(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(40),
      decoration: const BoxDecoration(
        color: Color(0xFFE3F2FD),
        border: Border(
          bottom: BorderSide(color: Color(0xFFE0E0E0)),
        ),
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(8),
          topRight: Radius.circular(8),
        ),
      ),
      child: Column(
        children: [
          Text(
            'Martin Malyshau',
            style: TextStyle(
              fontSize: MediaQuery.of(context).size.width < 600 ? 32 : 48,
              fontWeight: FontWeight.bold,
              color: const Color(0xFF1A1A1A),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 10),
          Text(
            'My portfolio',
            style: TextStyle(
              fontSize: MediaQuery.of(context).size.width < 600 ? 18 : 20,
              color: const Color(0xFF555555),
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildAboutSection() {
    final padding = MediaQuery.of(context).size.width < 600 ? 20.0 : 40.0;
    return Padding(
      padding: EdgeInsets.all(padding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'About',
            style: TextStyle(
              fontSize: 28,
              color: Color(0xFF1A1A1A),
            ),
          ),
          const SizedBox(height: 30),
          const Text(
            'I am a young programmer with interests in computer science and physics. '
            'Over the past years I have made several projects combining the two fields. '
            'I\'m proficient with python, specifically pygame: the python game development library. '
            'If you would like to hear more from me please subscribe to my YouTube channel or follow my GitHub account.',
            style: TextStyle(
              fontSize: 16,
              color: Color(0xFF555555),
              height: 1.6,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProjectsSection() {
    final padding = MediaQuery.of(context).size.width < 600 ? 20.0 : 40.0;
    final cardPadding = MediaQuery.of(context).size.width < 600 ? 20.0 : 40.0;

    final projects = [
      {
        'title': 'OrbitDance',
        'description':
            'This is a simple and lightweight gravitational simulator that can display the paths of three bodies under the effect of their gravitational forces.',
        'url': 'https://github.com/rrocketmann/OrbitDance',
      },
      {
        'title': 'Bigram',
        'description':
            'A simple Python-based algoritham that predicts the next word based on the last. It uses preloaded txt files and can generate strands of nonsense text.',
        'url': 'https://github.com/rrocketmann/bigram',
      },
      {
        'title': 'Conways game of life',
        'description':
            'This is an unofficial cell simulator following the ruleset of how cells are killed and born. Runs without a display and instead prints a matrix in terminal which represents the board.',
        'url': 'https://github.com/rrocketmann/conwaysgameoflife',
      },
      {
        'title': 'Labyrinth',
        'description':
            'A fun little maze game that has a string matrix map that can be modified at the top of the code.',
        'url': 'https://github.com/rrocketmann/labyrinth',
      },
      {
        'title': 'Music Player',
        'description':
            'Very basic desktop music player made with only a python backend and able to play a list of preloaded songs.',
        'url': 'https://github.com/rrocketmann/MusicPlayer',
      },
    ];

    return Padding(
      padding: EdgeInsets.all(padding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Projects',
            style: TextStyle(
              fontSize: 28,
              color: Color(0xFF1A1A1A),
            ),
          ),
          const SizedBox(height: 30),
          ...projects.map((project) => Padding(
                padding: const EdgeInsets.only(bottom: 40),
                child: Container(
                  padding: EdgeInsets.all(cardPadding),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFAFAFA),
                    border: Border.all(color: const Color(0xFFE0E0E0)),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        project['title']!,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFF1A1A1A),
                        ),
                      ),
                      const SizedBox(height: 15),
                      Text(
                        project['description']!,
                        style: const TextStyle(
                          fontSize: 16,
                          color: Color(0xFF555555),
                          height: 1.6,
                        ),
                      ),
                      const SizedBox(height: 20),
                      _buildButton('Details »', () => _launchURL(project['url']!)),
                    ],
                  ),
                ),
              )),
        ],
      ),
    );
  }

  Widget _buildContactSection() {
    final padding = MediaQuery.of(context).size.width < 600 ? 20.0 : 40.0;

    return Padding(
      padding: EdgeInsets.all(padding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Contact Me',
            style: TextStyle(
              fontSize: 28,
              color: Color(0xFF1A1A1A),
            ),
          ),
          const SizedBox(height: 30),
          Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Name:',
                  style: TextStyle(fontSize: 16, color: Color(0xFF1A1A1A)),
                ),
                const SizedBox(height: 5),
                TextFormField(
                  controller: _nameController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    contentPadding: EdgeInsets.all(12),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your name';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20),
                const Text(
                  'Email:',
                  style: TextStyle(fontSize: 16, color: Color(0xFF1A1A1A)),
                ),
                const SizedBox(height: 5),
                TextFormField(
                  controller: _emailController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    contentPadding: EdgeInsets.all(12),
                  ),
                  keyboardType: TextInputType.emailAddress,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your email';
                    }
                    if (!value.contains('@')) {
                      return 'Please enter a valid email';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20),
                const Text(
                  'Message:',
                  style: TextStyle(fontSize: 16, color: Color(0xFF1A1A1A)),
                ),
                const SizedBox(height: 5),
                TextFormField(
                  controller: _messageController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    contentPadding: EdgeInsets.all(12),
                  ),
                  maxLines: 5,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a message';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20),
                _buildButton('Submit', _submitForm),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLinksSection() {
    final padding = MediaQuery.of(context).size.width < 600 ? 20.0 : 40.0;

    return Padding(
      padding: EdgeInsets.all(padding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Links',
            style: TextStyle(
              fontSize: 28,
              color: Color(0xFF1A1A1A),
            ),
          ),
          const SizedBox(height: 30),
          const Text(
            'Here are the links to my YouTube and GitHub account. If you enjoy my work please follow one of these accounts. Thank you for visiting this website, it was hard to make.',
            style: TextStyle(
              fontSize: 16,
              color: Color(0xFF555555),
              height: 1.6,
            ),
          ),
          const SizedBox(height: 20),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: [
              _buildButton('YouTube »',
                  () => _launchURL('https://www.youtube.com/@yetanothernutrino')),
              _buildButton('GitHub »',
                  () => _launchURL('https://github.com/rrocketmann')),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFooter() {
    return Container(
      padding: const EdgeInsets.all(40),
      decoration: const BoxDecoration(
        color: Color(0xFFE8E8E8),
        border: Border(
          top: BorderSide(color: Color(0xFFE0E0E0)),
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(8),
          bottomRight: Radius.circular(8),
        ),
      ),
      child: const Text(
        '© Martin Malyshau 2025, made with Flutter',
        style: TextStyle(
          fontSize: 14,
          color: Color(0xFF666666),
        ),
        textAlign: TextAlign.center,
      ),
    );
  }

  Widget _buildButton(String text, VoidCallback onPressed) {
    return InkWell(
      onTap: onPressed,
      borderRadius: BorderRadius.circular(4),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 12),
        decoration: BoxDecoration(
          color: const Color(0xFFE3F2FD),
          border: Border.all(color: const Color(0xFFE0E0E0)),
          borderRadius: BorderRadius.circular(4),
        ),
        child: Text(
          text,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Color(0xFF1A1A1A),
          ),
        ),
      ),
    );
  }
}
