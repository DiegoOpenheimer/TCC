import 'package:flutter/material.dart';

class NewSuggestionWidget extends StatefulWidget {
  @override
  _NewSuggestionWidgetState createState() => _NewSuggestionWidgetState();
}

class _NewSuggestionWidgetState extends State<NewSuggestionWidget> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      floatingActionButton: FloatingActionButton.extended(
        label: Text('Salvar'),
      ),
    );
  }
}
