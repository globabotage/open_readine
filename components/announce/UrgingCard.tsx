"use client";
interface UrgingCardProps {
  bgColor?: string;
}

const UrgingCard: React.FC<UrgingCardProps> = ({ bgColor }) => {
  return (
    <div
      className={`w-auto flex flex-col items-centertext-yt-text-white p-5 rounded-lg text-sm space-y-3
        ${bgColor}
    
    `}
    >
      <div>
        🤔&nbsp;Readineは、数学や物理学その他専門書の行間をよみ、それを共有するための場所です。
        <br />
        とはいえ、難しく思う必要はありません。あなたが教科書の余白に書いたメモや、気づいてしまった誤植をこの場所で共有するだけで、十分に誰かの役に立つことがあります。
      </div>

      <div className="px-2 text-[13px] text-yt-text-gray">
        ReadineはTeXで数式を書けますが、手書きのメモの写真をアップロードするだけでも誰かのヒントになるでしょう💡
      </div>
    </div>
  );
};

export default UrgingCard;
