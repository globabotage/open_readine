//**このhooksについて
//**10桁と13桁が併記された書籍用に作ったがひとまず"使わない"
//**併記されている本が多くないため

const useConvertIsbn = (isbn: string) => {
  let isbn10: string = isbn;
  let isbn13: string = isbn;

  const isbn_length = String(isbn).length;

  if (isbn_length === 10) {
    // 1. 先頭に`978`を足して、末尾の1桁を除く
    const src = `978${isbn.slice(0, 9)}`;

    // 2. 先頭の桁から順に1、3、1、3…を掛けて合計する
    const sum = src
      .split("")
      .map((s) => parseInt(s))
      .reduce((p, c, i) => p + (i % 2 === 0 ? c : c * 3));

    // 3. 合計を10で割った余りを10から引く
    //※引き算の結果が10の時は0とする
    const rem = 10 - (sum % 10);
    const checkdigit = rem === 10 ? 0 : rem;

    isbn13 = src + checkdigit;
  } else if (isbn_length === 13) {
    // 1. 先頭３文字と末尾１文字を除く
    const src = isbn.slice(3, 12);

    // 2. 先頭の桁から順に10、9、8…2を掛けて合計する
    const sum = src
      .split("")
      .map((s) => parseInt(s))
      .reduce((p, c, i) => (i === 1 ? p * 10 : p) + c * (10 - i));

    // 3. 合計を11で割った余りを11から引く
    //※引き算の結果が11の場合は0、10の時はアルファベットのXにする）
    const rem = 11 - (sum % 11);
    const checkdigit = rem === 11 ? 0 : rem === 10 ? "X" : rem;

    isbn10 = src + checkdigit;
  }

  return { isbn10, isbn13 };
};

export default useConvertIsbn;
