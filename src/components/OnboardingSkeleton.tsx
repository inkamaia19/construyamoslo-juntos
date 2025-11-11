import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import OnboardingProgress from "./OnboardingProgress";

interface OnboardingSkeletonProps {
  currentStep: number;
  totalSteps: number;
  backTo: string;
}

const OnboardingSkeleton = ({ currentStep, totalSteps, backTo }: OnboardingSkeletonProps) => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-start gap-4 bg-background p-4 pt-8 md:pt-12 animate-fade-in">
      <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} backTo={backTo} />
      <Card className="w-full max-w-md flex flex-1 flex-col shadow-lg">
        <CardHeader className="items-center text-center">
          <Skeleton className="h-8 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-1/2 rounded-md mt-2" />
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center items-center gap-4">
          <Skeleton className="h-14 w-full rounded-full" />
          <Skeleton className="h-14 w-full rounded-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-14 w-full rounded-full" />
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingSkeleton;