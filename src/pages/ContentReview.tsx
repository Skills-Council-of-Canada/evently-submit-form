
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getContentTemplates, updateContentApproval } from "@/services/airtableService";
import { Check, X, RefreshCw, Clipboard, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import ContentReviewSkeleton from "@/components/content-review/ContentReviewSkeleton";
import { toast } from "@/hooks/use-toast";

const ContentReview = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("social");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState({
    socialMediaPost: "",
    pressRelease: "",
    newsletterContent: ""
  });
  const [reviewNotes, setReviewNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: contentTemplates, isLoading, isError, refetch } = useQuery({
    queryKey: ['contentTemplates', eventId],
    queryFn: () => getContentTemplates(eventId || ""),
    enabled: !!eventId,
  });

  const content = contentTemplates?.[0] || null;

  useEffect(() => {
    if (content) {
      setEditedContent({
        socialMediaPost: content.socialMediaPost,
        pressRelease: content.pressRelease,
        newsletterContent: content.newsletterContent
      });
    }
  }, [content]);

  const handleApprove = async () => {
    if (!content) return;
    
    setIsSubmitting(true);
    const success = await updateContentApproval(
      content.id,
      'approved',
      reviewNotes
    );
    
    setIsSubmitting(false);
    
    if (success) {
      toast({
        title: "Content Approved",
        description: "The content has been approved and is ready for publishing.",
      });
      navigate("/admin");
    } else {
      toast({
        title: "Error",
        description: "There was a problem approving the content.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!content) return;
    
    setIsSubmitting(true);
    const success = await updateContentApproval(
      content.id,
      'rejected',
      reviewNotes
    );
    
    setIsSubmitting(false);
    
    if (success) {
      toast({
        title: "Content Rejected",
        description: "The content has been rejected and sent back for revision.",
      });
      navigate("/admin");
    } else {
      toast({
        title: "Error",
        description: "There was a problem rejecting the content.",
        variant: "destructive",
      });
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard.",
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    // In a real implementation, you would save the edited content to Airtable here
    toast({
      title: "Changes Saved",
      description: "Your edits have been saved.",
    });
  };

  const handleRegenerate = () => {
    toast({
      title: "Regenerate Request Sent",
      description: "New content will be generated shortly.",
    });
    // In a real implementation, you would trigger Make.com to regenerate content
  };

  if (isLoading) {
    return <ContentReviewSkeleton />;
  }

  if (isError || !content) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Content</CardTitle>
            <CardDescription>
              We couldn't find any generated content for this event. It's possible that Make.com hasn't processed this event yet.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/admin")}>Return to Admin</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Content Review</h1>
        <p className="text-muted-foreground">
          Review and approve AI-generated content for event marketing
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="press">Press Release</TabsTrigger>
              <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            </TabsList>
            <TabsContent value="social" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Social Media Post</CardTitle>
                  <CardDescription>
                    Ready to share across Twitter, Facebook, and LinkedIn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={editedContent.socialMediaPost}
                      onChange={(e) => setEditedContent({...editedContent, socialMediaPost: e.target.value})}
                      className="min-h-[200px]"
                    />
                  ) : (
                    <div className="bg-muted p-4 rounded-md whitespace-pre-wrap min-h-[200px]">
                      {content.socialMediaPost}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleCopyToClipboard(content.socialMediaPost)}
                      className="mr-2"
                    >
                      <Clipboard className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    {isEditing ? (
                      <Button size="sm" onClick={handleSaveEdit}>
                        Save Changes
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={handleEdit}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleRegenerate}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="press" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Press Release</CardTitle>
                  <CardDescription>
                    Formal announcement for media outlets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={editedContent.pressRelease}
                      onChange={(e) => setEditedContent({...editedContent, pressRelease: e.target.value})}
                      className="min-h-[200px]"
                    />
                  ) : (
                    <div className="bg-muted p-4 rounded-md whitespace-pre-wrap min-h-[200px]">
                      {content.pressRelease}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleCopyToClipboard(content.pressRelease)}
                      className="mr-2"
                    >
                      <Clipboard className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    {isEditing ? (
                      <Button size="sm" onClick={handleSaveEdit}>
                        Save Changes
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={handleEdit}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleRegenerate}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="newsletter" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Newsletter Content</CardTitle>
                  <CardDescription>
                    Content snippet for email newsletters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={editedContent.newsletterContent}
                      onChange={(e) => setEditedContent({...editedContent, newsletterContent: e.target.value})}
                      className="min-h-[200px]"
                    />
                  ) : (
                    <div className="bg-muted p-4 rounded-md whitespace-pre-wrap min-h-[200px]">
                      {content.newsletterContent}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleCopyToClipboard(content.newsletterContent)}
                      className="mr-2"
                    >
                      <Clipboard className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    {isEditing ? (
                      <Button size="sm" onClick={handleSaveEdit}>
                        Save Changes
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={handleEdit}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleRegenerate}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Review Actions</CardTitle>
              <CardDescription>Approve or reject this content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Review Notes (Optional)</h3>
                  <Textarea
                    placeholder="Add any feedback or notes about this content..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button 
                className="w-full" 
                onClick={handleApprove}
                disabled={isSubmitting}
              >
                <Check className="mr-2 h-4 w-4" />
                Approve Content
              </Button>
              <Button 
                variant="outline" 
                className="w-full text-red-500 hover:text-red-700" 
                onClick={handleReject}
                disabled={isSubmitting}
              >
                <X className="mr-2 h-4 w-4" />
                Reject Content
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContentReview;
