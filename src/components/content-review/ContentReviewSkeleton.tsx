
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ContentReviewSkeleton = () => {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <Skeleton className="h-10 w-[300px] mb-2" />
        <Skeleton className="h-4 w-[450px]" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="social" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="press">Press Release</TabsTrigger>
              <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            </TabsList>
            <TabsContent value="social" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle><Skeleton className="h-6 w-[200px]" /></CardTitle>
                  <CardDescription><Skeleton className="h-4 w-[300px]" /></CardDescription>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[200px] w-full" />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Skeleton className="h-9 w-[100px]" />
                  <Skeleton className="h-9 w-[100px]" />
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle><Skeleton className="h-6 w-[150px]" /></CardTitle>
              <CardDescription><Skeleton className="h-4 w-[200px]" /></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-[150px] mb-2" />
                <Skeleton className="h-[100px] w-full" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContentReviewSkeleton;
