import getKatexExample from "@/actions/Admin/getKatexExample";
import Editor from "./_components/Editor";

const AdminKatexPage = async () => {
  const katexExample = await getKatexExample();

  return <Editor example={katexExample} />;
};

export default AdminKatexPage;
