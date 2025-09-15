import React from "react";
import { Heart, AlertTriangle, Pill, TrendingUp } from "lucide-react";

// Type definitions
interface Condition {
  id?: number;
  name: string;
  description: string;
}

interface ContentItem {
  type: "paragraph" | "bullets";
  text?: string;
  items?: string[];
}

interface ParsedSection {
  title: string;
  content: ContentItem[];
}

interface ConditionDescriptionProps {
  condition: Condition;
}

const ConditionDescription: React.FC<ConditionDescriptionProps> = ({
  condition,
}) => {
  // Parse the markdown-like description
  const parseDescription = (text: string): ParsedSection[] => {
    const sections = text.split("\n## ").filter((section) => section.trim());

    return sections
      .map((section) => {
        const lines = section.split("\n").filter((line) => line.trim());
        const title = lines[0].replace(/^#+ /, "").trim();
        const content = lines.slice(1);

        // Group bullet points
        const processedContent: ContentItem[] = [];
        let currentBulletGroup: string[] = [];

        content.forEach((line) => {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith("• ")) {
            currentBulletGroup.push(trimmedLine.substring(2));
          } else if (trimmedLine) {
            if (currentBulletGroup.length > 0) {
              processedContent.push({
                type: "bullets",
                items: [...currentBulletGroup],
              });
              currentBulletGroup = [];
            }
            processedContent.push({ type: "paragraph", text: trimmedLine });
          }
        });

        if (currentBulletGroup.length > 0) {
          processedContent.push({ type: "bullets", items: currentBulletGroup });
        }

        return { title, content: processedContent };
      })
      .filter((section) => section !== null) as ParsedSection[];
  };

  const sections = parseDescription(condition.description);

  const getSectionIcon = (title: string): React.ReactElement => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("meaning"))
      return <Heart className="w-5 h-5 text-blue-600" />;
    if (
      lowerTitle.includes("why it matters") ||
      lowerTitle.includes("drug interactions")
    )
      return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    if (lowerTitle.includes("drug classes") || lowerTitle.includes("watch out"))
      return <Pill className="w-5 h-5 text-red-600" />;
    if (lowerTitle.includes("causes") || lowerTitle.includes("triggers"))
      return <TrendingUp className="w-5 h-5 text-purple-600" />;
    return <Heart className="w-5 h-5 text-gray-600" />;
  };

  const getSectionColor = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("meaning")) return "border-blue-500 bg-blue-50";
    if (
      lowerTitle.includes("why it matters") ||
      lowerTitle.includes("drug interactions")
    )
      return "border-amber-500 bg-amber-50";
    if (lowerTitle.includes("drug classes") || lowerTitle.includes("watch out"))
      return "border-red-500 bg-red-50";
    if (lowerTitle.includes("causes") || lowerTitle.includes("triggers"))
      return "border-purple-500 bg-purple-50";
    return "border-gray-500 bg-gray-50";
  };

  return (
    <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              {getSectionIcon(section.title)}
              {section.title}
            </h3>
            <div
              className={`rounded-lg p-4 border-l-4 ${getSectionColor(
                section.title
              )}`}
            >
              {section.content.map((item, itemIndex) => (
                <div key={itemIndex} className="mb-3 last:mb-0">
                  {item.type === "paragraph" ? (
                    <p className="text-gray-700 leading-relaxed">{item.text}</p>
                  ) : (
                    <ul className="space-y-2">
                      {item.items?.map((bullet, bulletIndex) => (
                        <li
                          key={bulletIndex}
                          className="flex items-start gap-2"
                        >
                          <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="text-gray-700 leading-relaxed">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ConditionDescription;
