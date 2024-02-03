"use client";
import React, { useCallback, useContext, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import axios from "axios";
import BlotFormatter from "quill-blot-formatter";
import "react-quill/dist/quill.snow.css";
import { Quill } from "react-quill";
import katex from "katex";
import "katex/dist/katex.min.css";
window.katex = katex;

//↑ReactQuillのcssはここでインポートしておけばindex.cssなどに書かなくても良い。参照：https://www.npmjs.com/package/react-quill#with-webpack-or-create-react-app

const icons = Quill.import("ui/icons");

//**undo,redoの追加ココカラ

// undo, redoのアイコンを追加するためにはhistoryプロパティを型定義に追加する必要がある。Quill のインスタンス型を拡張している。
interface CustomQuill extends InstanceType<typeof Quill> {
  history: {
    undo: () => void;
    redo: () => void;
  };
}
//アイコン設置（GPTが提示したアイコンは非常にわかりづらい形状だった。次を参照して別のアイコンとした。参照：https://stackoverflow.com/questions/59555447/how-to-create-undo-redo-buttons-in-quill-js-react-quill
const undoIcon = `<svg viewbox="0 0 18 18">
    <polygon class="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"></polygon>
    <path class="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"></path>
  </svg>`;
const redoIcon = `<svg viewbox="0 0 18 18">
<polygon class="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"></polygon>
<path class="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"></path>
</svg>`;

icons["undo"] = undoIcon;
icons["redo"] = redoIcon;
//**undo,redoの追加ココマデ

//**hrの追加ココカラ
const Block = Quill.import("blots/block");

class Divider extends Block {
  static create() {
    const node = document.createElement("div");
    node.setAttribute("class", "divider");
    return node;
  }
}

Divider.blotName = "divider";
Divider.tagName = "div";
Quill.register(Divider);

const hrIcon =
  '<svg viewBox="0 0 18 18" width="18" height="18"><line x1="0" x2="18" y1="9" y2="9" stroke="#000" stroke-width="1"/></svg>';

icons["divider"] = hrIcon;

//**hrの追加ココマデ

//**blotFormatter（画像リサイズ機能）の追加 */
Quill.register("modules/blotFormatter", BlotFormatter);
// const { publicRuntimeConfig } = getConfig();
// const { cloudinaryUrl, cloudinaryUploadPreset } = publicRuntimeConfig;
interface Props {
  allowImageInsertion: boolean;
  value: string;
  onChange: (value: string) => void;
}

const QuillEditor = (props: Props) => {
  const quillRef = useRef<ReactQuill>(null);

  const undo = useMemo(
    () => () => {
      const quill = quillRef.current?.getEditor() as CustomQuill | undefined;
      if (quill) {
        quill.history.undo();
      }
    },
    []
  );

  const redo = useMemo(
    () => () => {
      const quill = quillRef.current?.getEditor() as CustomQuill | undefined;
      if (quill) {
        quill.history.redo();
      }
    },
    []
  );

  // フォーマットの設定(これがないとhrの表示と保存に不具合が生じる)
  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "align",
    "header",
    "list",
    "script",
    "indent",
    "direction",
    "color",
    "background",
    "link",
    "divider",
    "image",
  ];
  //参考GPT：https://chat.openai.com/c/3b18a225-032c-48c4-8662-ef1c4feb32d9
  // 画像アップロード用のハンドラ
  const handleImageUpload = useCallback(async () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    // ファイルを選択するための input タグを作成
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    // ファイルが選択されたら、それをアップロードする
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // FormData オブジェクトを作成し、Base64エンコードされた画像データを追加
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "lcmvuppi");

      try {
        // 画像をCloudinaryに送信
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dcxvklaer/image/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        //DBに関連付け把握用の情報を保存
        await axios.post("/api/upload_image", {
          url: response.data.url,
          public_id: response.data.public_id,
        });

        // 応答から保存された HTML を取得
        const savedImageUrl = response.data.url;
        // エディターに画像を挿入
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "image", savedImageUrl);
        quill.setSelection({ index: range.index + 1, length: 0 });
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };
  }, []);

  // ツールバーのオプションを設定
  //useMemoを使用しないと、props更新のたびにmodulesが再生成され、これを参照しているReactQuillが再レンダリングされてしまう。そしてホワイトアウトが生じる。参照：https://github.com/zenoamaro/react-quill/issues/688
  const modules = useMemo(
    () => ({
      blotFormatter: {}, //画像のサイズを変更するためのオプション
      history: {
        delay: 1000,
        //遅延を設定することで短期間でまとめて操作した場合に、一つの操作として扱うことができる。
        maxStack: 50,
        //Undo/Redoスタックの最大サイズ。スタックが最大サイズに達すると、古いアクションが新しいアクションで上書きされ回数が制限されます。
        userOnly: true,
        // trueに設定されている場合、Quillが自動的に行う変更（API経由での変更など）はアンドゥやリドゥの対象外となる。falseに設定すると、API経由での変更もアンドゥやリドゥの対象になる。
      },
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike"], // スタイル
          // ['blockquote', 'code-block'], // ブロック
          [{ align: [] }], // テキストのalignment
          [props.allowImageInsertion ? "image" : ""], // 画像挿入(スケジュール作成では非表示)
          [{ header: [1, 2, 3, 4, 5, 6, false] }], // ヘッダーレベル
          // [{ size: ['small', false, 'large', 'huge'] }], // テキストサイズ
          // [{ header: 1 }, { header: 2 }], // ヘッダー
          [{ list: "ordered" }, { list: "bullet" }], // リスト
          [{ script: "sub" }, { script: "super" }], // 上付き文字、下付き文字
          [{ indent: "-1" }, { indent: "+1" }], // インデント
          [{ direction: "rtl" }], // テキストの方向

          ["link", "formula"],
          ["divider"], // 水平線
          [{ color: [] }, { background: [] }], // テキストカラー、背景カラー
          ["clean"], // 書式のクリア
          ["undo", "redo"], // undoおよびredoボタンを追加
        ],
        handlers: {
          image: handleImageUpload,
          undo: undo,
          redo: redo,
        },
      },
    }),
    [handleImageUpload, props.allowImageInsertion, redo, undo]
  );

  return (
    <ReactQuill
      ref={quillRef}
      modules={modules}
      value={props.value}
      onChange={props.onChange}
      theme="snow"
      formats={formats}
      //styleを追加すると画像alignがうまく反映されない
      //cssクラスのql-containerでスタイルを設定する
      // ...他のプロパティ
    />
  );
};

export default QuillEditor;
