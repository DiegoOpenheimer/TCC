import 'package:bloc_pattern/bloc_pattern.dart';
import 'package:bus_locator_mobile/blocs/Application-bloc.dart';
import 'package:bus_locator_mobile/components/error/message-error-widget.dart';
import 'package:bus_locator_mobile/components/fab/fab-loading.dart';
import 'package:bus_locator_mobile/model/device.dart';
import 'package:bus_locator_mobile/model/score.dart';
import 'package:bus_locator_mobile/pages/evaluate/evaluate-bloc.dart';
import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';

class EvaluateWidget extends StatefulWidget {

  final Device device;

  EvaluateWidget(this.device);

  @override
  _EvaluateWidgetState createState() => _EvaluateWidgetState();
}

class _EvaluateWidgetState extends State<EvaluateWidget> {

  ApplicationBloc _applicationBloc = BlocProvider.getBloc<ApplicationBloc>();
  TextEditingController _controllerMessage = TextEditingController();
  EvaluateBloc _evaluateBloc = BlocProvider.getBloc<EvaluateBloc>();


  @override
  void initState() {
    super.initState();
    init();
  }

  void init() async {
    var score = await _evaluateBloc.getScore(widget.device.line);
    if (score != null && score.description != null) {
      _controllerMessage.text = score.description;
    }
  }

  @override
  Widget build(BuildContext context) {
    AppBar appBar = _applicationBloc.currentTheme == ThemeApplication.LIGHT ? AppBar(
      title: Text('Avaliar linha: ' + widget.device.lineDescription, style: TextStyle(color: Colors.black),),
      backgroundColor: Colors.white, brightness: Brightness.light,
      iconTheme: IconThemeData(color: Colors.black),
    ) : AppBar(title: Text('Avaliar linha: ' + widget.device.lineDescription));
    return GestureDetector(
      onTap: () => FocusScope.of(context).requestFocus(FocusNode()),
      child: Scaffold(
        appBar: appBar,
        floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
        floatingActionButton: buildFabLoading(),
        body: _loadInformation(),
      ),
    );
  }

  Widget _loadInformation() {
    return StreamBuilder<Score>(
      stream: _evaluateBloc.listener,
      builder: (context, snapshot) {
        if (snapshot.hasError) {
          return ErrorMessageWidget(
            text: snapshot.error.toString(),
            onPressIcon: () => _evaluateBloc.getScore(widget.device.line),
            showIcon: true,
          );
        }
        if (!snapshot.hasData) {
          return Center(child: CircularProgressIndicator(),);
        }
        return SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: _body(),
          ),
        );
      },
    );
  }

  Widget buildFabLoading() {
    return StreamBuilder<bool>(
      stream: _evaluateBloc.listenerLoading,
      initialData: false,
      builder: (context, snapshot) {
        return FabLoading(
            loading: snapshot.data,
            onPress: () {
              FocusScope.of(context).requestFocus(FocusNode());
              _evaluateBloc.executeOperation(_controllerMessage.text, widget.device.line);
            }
        );
      }
    );
  }

  Widget _body() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text('Avalie essa linha, para que possamos continuar melhorando cada vez mais, o nosso serviço:', style: TextStyle(fontSize: 18),),
        const SizedBox(height: 16,),
        TextField(
          controller: _controllerMessage,
          maxLines: null,
          maxLength: 500,
          decoration: const InputDecoration(
            contentPadding: const EdgeInsets.symmetric(vertical: 4),
            labelText: 'Mensagem',
            hintMaxLines: 10,
          ),
        ),
        const SizedBox(height: 16,),
        Align(
          alignment: Alignment.center,
          child: RatingBar(
            initialRating: _evaluateBloc.currentScore?.star?.toDouble() ?? 5,
            onRatingUpdate: (double value) => _evaluateBloc.setStar(value.toInt()),
            itemBuilder: (context, _) => Icon(
              Icons.star,
              color: Colors.amber,
            ),
          ),
        )
      ],
    );
  }
}
