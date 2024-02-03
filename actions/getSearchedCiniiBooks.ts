"use client";
import { SafeBook } from "@/types";
import axios from "axios";

export default async function getSearchedCiniiBooks(query: string) {
  try {
    let results: SafeBook[] = [];
    let count: number = 0;

    if (query === "") {
      return { results, count };
    }
    await axios
      .get(
        "https://ci.nii.ac.jp/books/opensearch/search?appid=bhQK8LN6BZHy0OF9tdrC&format=json&count=100&q=" +
          query
      )
      //仕様：https://support.nii.ac.jp/ja/cia/api/a_opensearch
      //CiNiiの最大表示件数は200
      .then((res) => {
        count = Number(res.data["@graph"][0]["opensearch:totalResults"]);

        const apiResults = res.data["@graph"][0]["items"];

        apiResults.map((result: any) => {
          results.push({
            title: result.title,
            titleAlphabet: "",
            author: result["dc:creator"],
            published: result["dc:date"],
            publisher: result["dc:publisher"]?.[0],
            isbn: result["dcterms:hasPart"]?.[0]["@id"].split(":")[2],
            oldId: null,
            //ISBN未付与の場合があるため、undefinedの場合は空文字を返す
          });
        });
      });
    return { results, count };
  } catch (error: any) {
    return {
      results: [],
      count: 0,
    };
  }
}
