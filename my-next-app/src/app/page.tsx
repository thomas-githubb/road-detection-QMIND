import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-background text-foreground relative px-6">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold leading-tight">
            Detect Road Damage with AI
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload your POV drive footage, let our AI analyze road conditions,
            and use actionable insights for your operations.
          </p>
          <Button asChild>
            <a href="/get-started">Get Started</a>
          </Button>
        </div>
        <div className="absolute inset-0 -z-10">
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 w-full h-full" />
        </div>
      </section>

      {/* Parallax Section */}
      <section className="bg-secondary text-secondary-foreground py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <h2 className="text-4xl font-bold text-center">
            From Footage to Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-lg flex flex-col items-center justify-center text-center p-6">
              <CardContent>
                <CardTitle className="text-xl font-bold">Step 1</CardTitle>
                <p className="text-sm mt-2">Upload your POV drive footage.</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg flex flex-col items-center justify-center text-center p-6">
              <CardContent>
                <CardTitle className="text-xl font-bold">Step 2</CardTitle>
                <p className="text-sm mt-2">
                  AI detects road damage in the footage.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg flex flex-col items-center justify-center text-center p-6">
              <CardContent>
                <CardTitle className="text-xl font-bold">Step 3</CardTitle>
                <p className="text-sm mt-2">
                  Insights are displayed on a dynamic map.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 bg-background text-foreground flex flex-col items-center justify-center px-6">
        <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <Button size="lg" asChild>
          <a href="/get-started">Start Now</a>
        </Button>
      </section>
    </div>
  );
}
