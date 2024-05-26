# turn-off-the-light-api

🍾🍾🍾 ライトを消すためのAPIを実装する！  

## 環境構築

最初にAWS CLIをインストールします。  
<https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/install-cliv2.html>  

以下のコマンドを実行して、AWS CLIのバージョンが表示されればOKです。  

```shell
aws --version
```

認証情報を設定します。  

```shell
aws configure
```

以下のように聞かれるので、適宜入力してください。

```shell
AWS Access Key ID [None]: アクセスキーID
AWS Secret Access Key [None]: シークレットアクセスキー
Default region name [None]: リージョン名
Default output format [None]: json
```

これらの情報は、AWSのコンソール画面から確認できます。  
IAMのページから指定のユーザを選択肢、アクセスキーを発行してください。  

続いて、AWS SAMをインストールします。  
こちらはサーバレスアプリケーションを構築するためのツールです。  
<https://docs.aws.amazon.com/ja_jp/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html>  

以下のコマンドを実行して、AWS SAMのバージョンが表示されればOKです。  

```shell
sam --version
```

サーバサイドアプリケーションを開発用に実行するためには、以下のコマンドを実行します。  

```shell
sam build --use-container
sam local start-api
```

## 本番環境の準備

### GitHub Secretsの設定

| キー | バリュー |
| --- | --- |
| STACK_NAME | プロジェクト名(CloudFormationのスタック名) |
| AWS_ACCESS_KEY_ID | AWSのアクセスキーID |
| AWS_SECRET_ACCESS_KEY | AWSのシークレットアクセスキー |
| AWS_REGION | リージョン名 |

### デプロイ

`v-*`形式のタグをつけると、GitHub Actionsがデプロイを行います。  
手動でデプロイする場合は、以下のコマンドを実行してください。  

```shell
sam build --use-container
sam deploy --stack-name <スタック名>

# 例)
sam build --use-container
sam deploy --stack-name turn-off-the-light-api
```

各種出力データを確認するためには、以下のコマンドを実行してください。  

```shell
aws cloudformation describe-stacks --stack-name <スタック名> --query 'Stacks[].Outputs'

# 例)
aws cloudformation describe-stacks --stack-name turn-off-the-light-api --query 'Stacks[].Outputs'
```

Lambda関数を呼び出すには、以下のコマンドを実行してください。  

```shell
aws lambda invoke --function-name $(aws cloudformation describe-stacks --stack-name <スタック名> --query 'Stacks[].Outputs[?OutputKey==`PingFunctionName`].OutputValue' --output text) --payload '{}' response.json

# 例)
aws lambda invoke --function-name $(aws cloudformation describe-stacks --stack-name turn-off-the-light-api --query 'Stacks[].Outputs[?OutputKey==`PingFunctionName`].OutputValue' --output text) --payload '{}' response.json
```
