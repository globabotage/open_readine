"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const Redirector: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/tag/" + encodeURIComponent("べき零群")) {
      router.push("/interest/6528d6c77fc050017a2893ec");
      return;
    }

    if (pathname === "/tag/" + encodeURIComponent("熱的ド・ブロイ波長")) {
      router.push("/interest/6528d6ed7fc050017a289435");
      return;
    }

    if (pathname === "/tag/" + encodeURIComponent("コーシー・アダマール")) {
      router.push("/interest/6528d6a17fc050017a2893a4");
      return;
    }

    if (pathname === "/tag/" + encodeURIComponent("田崎統計")) {
      router.push("/interest/6528d6d37fc050017a289403");
      return;
    }

    if (pathname === "/tag/" + encodeURIComponent("準開基")) {
      router.push("/interest/6528d6c37fc050017a2893e5");
      return;
    }

    if (pathname === "/tag/" + encodeURIComponent("有限交叉性")) {
      router.push("/interest/6528d6be7fc050017a2893db");
      return;
    }

    if (pathname === "/tag/peskin") {
      router.push("/interest/6528d6cc7fc050017a2893f6");
      return;
    }

    if (
      pathname ===
      "/tag/" + encodeURIComponent("バナッハ・スタインハウスの定理")
    ) {
      router.push("/interest/6528d6e17fc050017a28941f");
      return;
    }

    if (pathname === "/tag/" + encodeURIComponent("中心化移動平均")) {
      router.push("/interest/6528d67d7fc050017a28935e");
      return;
    }

    if (pathname === "/between/97") {
      //ml不等式->複素関数論の基礎
      router.push(
        "/book/6528c9f57fc050017a28914b?linesId=6528cabe7fc050017a2891ab"
      );
      return;
    }

    if (pathname === "/between/100") {
      //query:"雪江　代数学"=>『代数学1群論入門』p29-p30
      router.push(
        "/book/6528c9f37fc050017a289148?linesId=6528cac07fc050017a2891ae"
      );
      return;
    }

    if (pathname === "/between/131") {
      router.push(
        "/book/6528c9fa7fc050017a289154?linesId=6528cad87fc050017a2891cc"
      );
      return;
    }

    if (pathname === "/between/127") {
      router.push(
        "/book/6528c9fb7fc050017a289157?linesId=6528cad57fc050017a2891c9"
      );
      return;
    }

    if (pathname === "/between/143") {
      //Reffered in X (twitter)
      router.push(
        "/book/6528c9f37fc050017a289148?linesId=6528cae07fc050017a2891d7"
      );
      return;
    }

    if (pathname === "/between/193") {
      //search query：鞍点法 -> An introduction to ~ p.14
      router.push(
        "/book/6528c9fd7fc050017a28915a?linesId=6528cae97fc050017a2891e3"
      );
      return;
    }

    if (pathname === "/book/21") {
      //計算で身につくトポロジー
      router.push("/book/6528c9f37fc050017a289147");
      return;
    }

    if (pathname === "/book/49") {
      //理論電磁気学
      router.push("/book/6528ca017fc050017a289162");
      return;
    }

    router.push("/");
  }, [pathname, router]);

  return (
    <div className=" w-full h-full absolute top-1/2 text-yt-text-gray text-lg font-light text-center">
      Redirecting...
    </div>
  );
};

export default Redirector;
