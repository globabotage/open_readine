"use client";
import React, { useCallback, useContext, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import axios from "axios";
import "react-quill/dist/quill.snow.css";

interface Props {
  allowImageInsertion: boolean;
  value: string;
  onChange: (value: string) => void;
  onImageUploadComplete: () => void;
}

const QuillEditor = (props: Props) => {
  const quillRef = useRef<ReactQuill>(null);

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

      // FormData オブジェクトを作成し、画像ファイルを追加
      const formData = new FormData();
      formData.append("image", file);

      try {
        // 画像をサーバーに送信
        const response = await axios.post("/api/cloudinary", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // 応答から保存された HTML を取得
        const savedImageUrl = response.data.url;

        // エディターに画像を挿入
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "image", savedImageUrl);
        quill.setSelection({ index: range.index + 1, length: 0 });

        //基本的にはキャプチャ候補を取得する処理が入る
        props.onImageUploadComplete();
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };
  }, [props]);

  const modules = useMemo(
    () => ({
      blotFormatter: {}, //画像のサイズを変更するためのオプション
      toolbar: {
        handlers: {
          image: handleImageUpload,
        },
      },
    }),
    [handleImageUpload]
  );

  return (
    <ReactQuill
      ref={quillRef}
      modules={modules}
      value={props.value}
      onChange={props.onChange}
      theme="snow"
    />
  );
};

export default QuillEditor;
