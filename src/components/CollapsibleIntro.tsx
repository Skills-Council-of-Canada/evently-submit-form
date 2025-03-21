
import React from "react";
import { ChevronDown } from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";

const CollapsibleIntro = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="mb-4">
      <p className="text-gray-700 mb-2">
        The following form is part of an innovative new system designed to spotlight the incredible work happening across Peel District School Board.
      </p>
      
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="border rounded-md p-2 bg-[#FEF7CD]"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 italic">
            {isOpen ? "Click to collapse details" : "Click to learn more about this system"}
          </p>
          <CollapsibleTrigger className="p-1 rounded-full hover:bg-gray-200 transition-colors">
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`} />
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="mt-2 space-y-3 text-sm">
          <p>
            Whether it's a school event, a student or teacher achievement, a classroom innovation, or a community partnership, this tool helps capture your story and automatically transforms it into curated content.
          </p>
          
          <div>
            <p className="font-medium mb-1">Submissions are reviewed, refined, and formatted into:</p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>Blogs</li>
              <li>Press Releases</li>
              <li>Social Media Posts</li>
              <li>Board-Wide Features</li>
            </ul>
          </div>
          
          <p>
            Our goal is to streamline communications, increase public awareness, and enhance the public reputation of PDSB schools by sharing the real, inspiring stories that reflect our students' and staff's dedication, innovation, and success.
          </p>
          
          <p>
            Once submitted, your story flows through a seamless system—getting the attention and recognition it deserves across the board and beyond.
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CollapsibleIntro;
