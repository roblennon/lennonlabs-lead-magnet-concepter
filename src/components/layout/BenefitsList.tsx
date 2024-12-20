interface BenefitsListProps {
  benefits: string[];
}

export const BenefitsList = ({ benefits }: BenefitsListProps) => {
  return (
    <ul className="space-y-4">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-start space-x-3 text-muted-foreground">
          <svg className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span>{benefit}</span>
        </li>
      ))}
    </ul>
  );
};