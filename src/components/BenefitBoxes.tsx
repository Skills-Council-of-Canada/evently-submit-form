
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

type BenefitProps = {
  icon: string;
  title: string;
  description: string;
};

const Benefit = ({ icon, title, description }: BenefitProps) => {
  return (
    <Card className="flex-1 border-event-light-purple hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="text-lg font-semibold text-event-purple mb-2">{title}</h3>
        <p className="text-gray-700 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

const BenefitBoxes = () => {
  const benefits = [
    {
      icon: "🎯",
      title: "Amplify Impact",
      description: "Turn your achievements into powerful communications that elevate your school and inspire others."
    },
    {
      icon: "⚙️",
      title: "Simplify the Process",
      description: "Submit once—our system handles the rest. No need to write or edit content—we do it for you."
    },
    {
      icon: "📈",
      title: "Boost School Visibility",
      description: "Reach the public, parents, and the board with compelling stories that highlight your school's excellence."
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-5 text-center">Why This Matters to Your School</h2>
      <div className="flex flex-col md:flex-row gap-4">
        {benefits.map((benefit, index) => (
          <Benefit
            key={index}
            icon={benefit.icon}
            title={benefit.title}
            description={benefit.description}
          />
        ))}
      </div>
    </div>
  );
};

export default BenefitBoxes;
