import { SafeBook } from "@/types";
import https from "https";
// interface BooksResult {
//   results: SafeBook[];
//   count: number;
// }
export default async function getSearchedCinii(
  query: string
): Promise<SafeBook[]> {
  //Use http module instead of axios because I want to execute the following as a server-side function.
  try {
    let results: SafeBook[] = [];

    if (query === "") {
      return results;
    }

    const url =
      "https://ci.nii.ac.jp/books/opensearch/search?appid=bhQK8LN6BZHy0OF9tdrC&format=json&count=100&q=" +
      query;

    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          let body = "";

          res.on("data", (chunk) => {
            body += chunk;
          });
          //chunk パラメータは、サーバーから送られてきたデータの一部分を表しています。この chunk を body という変数に追加しています。これにより、全てのデータが到着すると body には完全なレスポンスデータが格納されます。このようにデータをチャンクとして受け取る理由は、大きなデータを一度に受け取るとメモリを大量に消費するため、データを小さな部分に分けて少しずつ受け取ることでメモリ使用量を抑えることができるからです。

          res.on("end", () => {
            const response = JSON.parse(body);
            // count = Number(response["@graph"][0]["opensearch:totalResults"]);

            const apiResults = response["@graph"][0]["items"];

            apiResults?.map((result: any) => {
              //this "?" is necessary though error is not shown
              results.push({
                title: result.title,
                titleAlphabet: "",
                author: result["dc:creator"],
                published: result["dc:date"],
                publisher: result["dc:publisher"]?.[0],
                isbn: result["dcterms:hasPart"]?.[0]["@id"].split(":")[2],
                oldId: null,
              });
            });

            resolve(results);
          });
        })
        .on("error", (error) => {
          reject(results);
        });
    });
  } catch (error: any) {
    return [];
  }
}
