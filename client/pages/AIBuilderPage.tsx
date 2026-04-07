import { AIBuilder } from "@/components/ai-builder/AIBuilder";

export default function AIBuilderPage() {
  return (
    <AIBuilder
      onBack={() => window.history.back()}
      onGenerateComplete={(layout) => console.log("Generated layout:", layout)}
    />
  );
}
