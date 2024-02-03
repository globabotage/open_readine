import { PrismaClient } from "@prisma/client";

//このコードは、Prismaというオープンソースデータベースツールを使用してデータベースとの接続を管理するためのものです。

declare global {
  var prisma: PrismaClient | undefined;
}
//ここでは、グローバルスコープにprismaという名前の変数を宣言しています。この変数は、PrismaClientのインスタンスかundefinedのどちらかを保持します。

const client = globalThis.prisma || new PrismaClient();
//この行では、新しいPrismaClientのインスタンスを作成していますが、グローバルスコープにすでに存在する場合はそれを再利用します。これにより、同じリクエストの中で複数回データベースに接続するのを防ぐことができます。

if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

//開発環境では（つまりNODE_ENVがproductionでない場合）、PrismaClientのインスタンスをグローバルスコープに保存します。これにより、ホットリローディング（ソースコードを更新してアプリケーションを再起動することなく変更を反映する機能）を使用しているときに、開発環境でPrismaClientインスタンスを再利用することができます。ただし、プロダクション環境では、このグローバルインスタンスは作成されません。これは、プロダクション環境では新たなPrismaClientインスタンスがリクエストごとに作成され、リクエストの最後で破棄されるべきだからです。

export default client;

//上記コメントはchatGPTによるもの（https://chat.openai.com/share/5e9cca96-16f4-4650-9241-c3781c90df14)
