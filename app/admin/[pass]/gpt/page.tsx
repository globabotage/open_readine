import getPrompots from "@/actions/Admin/getPrompts";
import Client from "./_components/Client";

const GptPage = async () => {
  const prompts = await getPrompots();
  return <Client prompts={prompts} />;
};

export default GptPage;
