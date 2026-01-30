import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/shared/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/shared/components/ui/carousel";

export function FeaturedTemplates({ templates }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Official Templates</h2>
      <Carousel className="w-full">
        <CarouselContent>
          {templates.map(template => (
            <CarouselItem key={template.id} className="md:basis-1/3">
              <Card>
                <CardHeader>
                  <Badge variant="secondary">Official</Badge>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full">Use Template</Button>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}