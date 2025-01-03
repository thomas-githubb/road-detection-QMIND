import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="space-y-4">
        {/* Card Component */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-xl font-bold">ShadCN UI Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is a test to ensure ShadCN UI components are working as
              expected.
            </p>
            {/* Input Component */}
            <Input
              type="text"
              placeholder="Type something..."
              className="mt-4"
            />
          </CardContent>
          <CardFooter>
            {/* Button Component */}
            <Button>Click Me</Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
