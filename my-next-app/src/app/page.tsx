import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD

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
=======
import Link from "next/link";

export default function Home() {
  const useCases = [
    {
      title: "Road Maintenance Planning",
      description:
        "Optimize resource allocation by identifying and mapping damaged road sections.",
    },
    {
      title: "Insurance Assessment",
      description:
        "Provide visual evidence of road conditions for claim processing.",
    },
    {
      title: "Municipal Road Inspection",
      description:
        "Automate routine road inspections to monitor and maintain safety.",
    },
    {
      title: "Infrastructure Development",
      description:
        "Assess road quality pre- and post-construction for better durability.",
    },
    {
      title: "Autonomous Vehicle Navigation",
      description:
        "Improve route safety by providing detailed road condition data.",
    },
    {
      title: "Public Safety Enhancement",
      description:
        "Identify and repair hazardous road sections to reduce accidents.",
    },
    {
      title: "Environmental Impact Analysis",
      description: "Study how weather and disasters contribute to road damage.",
    },
    {
      title: "Logistics Optimization",
      description:
        "Reroute shipments to avoid damaged roads and minimize costs.",
    },
    {
      title: "Disaster Recovery",
      description:
        "Prioritize repairs after natural disasters to restore critical transportation networks.",
    },
  ];

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "linear-gradient(120deg, #ff7eb3, #ff758c, #ff6b68, #ff914d)",
            clipPath: "polygon(0 0, 100% 0, 100% 80%, 0 100%)",
          }}
        ></div>
        <div className="flex justify-between items-center px-20 w-5/6 mx-auto">
          <div className="w-[80vh] space-y-6">
            <h1 className="text-[clamp(2rem,5vw,8rem)] font-extrabold leading-tight text-black">
              Detect Road Damage with AI
            </h1>
            <p className="text-[clamp(0.5rem,2vw,2rem)] text-black leading-tight font-bold">
              Upload your POV drive footage, let our AI analyze road conditions,
              and use actionable insights for your operations.
            </p>
          </div>
          <div className="w-[60vh] flex flex-col items-center space-y-10">
            <Button className="bg-black text-white hover:bg-black/20 w-64 h-20 text-3xl">
              <a href="/get-started">Get Started</a>
            </Button>
            <Button className="bg-black text-white hover:bg-black/20 w-64 h-20 text-3xl">
              <a href="/sign-in">Sign In</a>
            </Button>
          </div>
>>>>>>> 0fcc3e25d6c749ff37e39b73da8073ba853e98ad
        </div>
      </section>

      {/* Parallax Section */}
<<<<<<< HEAD
      <section className="bg-secondary text-secondary-foreground py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <h2 className="text-4xl font-bold text-center">
=======
      <section className="relative bg-secondary text-secondary-foreground px-6 h-[160vh]">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "linear-gradient(120deg, #3CB371, #48D1CC, #5F9EA0, #4682B4)",
            clipPath: "polygon(0 10%, 100% 0, 100% 100%, 0 100%)",
          }}
        ></div>
        <div className="max-w-6xl mx-auto space-y-12">
          <h2 className="text-6xl font-bold text-right ml-auto pt-40">
>>>>>>> 0fcc3e25d6c749ff37e39b73da8073ba853e98ad
            From Footage to Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-lg flex flex-col items-center justify-center text-center p-6">
              <CardContent>
<<<<<<< HEAD
                <CardTitle className="text-xl font-bold">Step 1</CardTitle>
                <p className="text-sm mt-2">Upload your POV drive footage.</p>
=======
                <CardTitle className="text-3xl font-bold">Step 1</CardTitle>
                <p className="text-lg mt-2">Upload your POV drive footage.</p>
>>>>>>> 0fcc3e25d6c749ff37e39b73da8073ba853e98ad
              </CardContent>
            </Card>
            <Card className="shadow-lg flex flex-col items-center justify-center text-center p-6">
              <CardContent>
<<<<<<< HEAD
                <CardTitle className="text-xl font-bold">Step 2</CardTitle>
                <p className="text-sm mt-2">
=======
                <CardTitle className="text-3xl font-bold">Step 2</CardTitle>
                <p className="text-lg mt-2">
>>>>>>> 0fcc3e25d6c749ff37e39b73da8073ba853e98ad
                  AI detects road damage in the footage.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg flex flex-col items-center justify-center text-center p-6">
              <CardContent>
<<<<<<< HEAD
                <CardTitle className="text-xl font-bold">Step 3</CardTitle>
                <p className="text-sm mt-2">
=======
                <CardTitle className="text-3xl font-bold">Step 3</CardTitle>
                <p className="text-lg mt-2">
>>>>>>> 0fcc3e25d6c749ff37e39b73da8073ba853e98ad
                  Insights are displayed on a dynamic map.
                </p>
              </CardContent>
            </Card>
          </div>
<<<<<<< HEAD
=======
          <div className="mt-12">
            <video
              className="mx-auto rounded-lg shadow-lg"
              width="1280"
              height="720"
              controls
            >
              <source src="/videos/demoVideo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <h3 className="text-3xl font-bold text-center mt-10">
              Watch the Process in Action
            </h3>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="bg-gray-300 text-foreground py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <h2 className="text-5xl font-bold text-black text-center">
            How You Can Use Pave AI
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card
                key={index}
                className="shadow-lg flex flex-col items-center justify-center p-6"
              >
                <CardContent className="text-center">
                  <CardTitle>{useCase.title}</CardTitle>
                  <p className="text-sm mt-2">{useCase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
>>>>>>> 0fcc3e25d6c749ff37e39b73da8073ba853e98ad
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 bg-background text-foreground flex flex-col items-center justify-center px-6">
        <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
<<<<<<< HEAD
        <Button size="lg" asChild>
=======
        <Button className="bg-black text-white hover:bg-black/20 w-64 h-20 text-3xl">
>>>>>>> 0fcc3e25d6c749ff37e39b73da8073ba853e98ad
          <a href="/get-started">Start Now</a>
        </Button>
      </section>
    </div>
  );
}
