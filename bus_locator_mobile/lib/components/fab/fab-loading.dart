import 'package:flutter/material.dart';

class FabLoading extends StatelessWidget {

  final bool loading;
  final Function onPress;
  final String heroTag;

  FabLoading({ this.loading = false, @required this.onPress, this.heroTag = 'hero-fab' }) : assert(onPress != null);


  @override
  Widget build(BuildContext context) {
    return AnimatedCrossFade(
      alignment: Alignment.center,
      duration: const Duration(milliseconds: 300),
      firstChild: Padding(
        padding: const EdgeInsets.all(8.0),
        child: FloatingActionButton.extended(
          heroTag: heroTag,
          onPressed: onPress,
          label: Text('Salvar'),
        ),
      ),
      secondChild: Padding(
        padding: const EdgeInsets.all(8.0),
        child: FloatingActionButton(
          heroTag: 'hero-fab-loading-suggestion',
          onPressed: null,
          child: CircularProgressIndicator(valueColor: AlwaysStoppedAnimation(Colors.white),),
        ),
      ),
      crossFadeState: !loading ? CrossFadeState.showFirst : CrossFadeState.showSecond,
    );
  }
}
