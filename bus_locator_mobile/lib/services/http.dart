import 'package:bus_locator_mobile/services/connection-network.dart';
import 'package:connectivity/connectivity.dart';
import 'package:dio/dio.dart';
import 'shared-preference.dart';

const int timeout = 5000;

class Http {

  ConnectionNetwork _connectionNetwork = ConnectionNetwork();

  Dio _dio = Dio(
      BaseOptions(
        connectTimeout: timeout,
        receiveTimeout: timeout,
        baseUrl: 'http://ec2-18-228-196-51.sa-east-1.compute.amazonaws.com:3001',
      )
  )..interceptors
      .add(InterceptorsWrapper(
    onRequest: (Options options) async {
      String token = await SharedPreferenceService().getToken();
      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = token;
      }
      return options;
    }
  ))
  ..interceptors.add(LogInterceptor(requestBody: true, responseBody: true));


  Future post(String path, Map<String, dynamic> body, { CancelToken cancelToken }) async {
    if (await _connectionNetwork.connectivityResult != ConnectivityResult.none) {
      return _dio.post(path, data: body, cancelToken: cancelToken);
    } else {
      throw new ErrorWithoutConnection();
    }
  }

  Future put(String path, Map<String, dynamic> body, { CancelToken cancelToken }) async {
    if (await _connectionNetwork.connectivityResult != ConnectivityResult.none) {
      return _dio.put(path, data: body, cancelToken: cancelToken);
    } else {
      throw new ErrorWithoutConnection();
    }
  }

  Future get(String path, { Map<String, dynamic> query = const {}, CancelToken cancelToken }) async {
    if (await _connectionNetwork.connectivityResult != ConnectivityResult.none) {
      return _dio.get(path, queryParameters: query, cancelToken: cancelToken);
    } else {
      throw new ErrorWithoutConnection();
    }
  }
  
  Future delete(String path, { Map<String, dynamic> query = const {}, CancelToken cancelToken }) async {
    if (await _connectionNetwork.connectivityResult != ConnectivityResult.none) {
      return _dio.delete(path, queryParameters: query, cancelToken: cancelToken);
    } else {
      throw new ErrorWithoutConnection();
    }

  }

}