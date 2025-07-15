import { trpc, getQueryClient } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { ProjectView } from "@/modules/projects/Ui/views/project-view";
import { Suspense } from "react";


interface Props {
    params: Promise<{
        projectId: string;
    }>
};

const Page = async ({ params }: Props) => {
    const { projectId } = await params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.messages.getMany.queryOptions({
        projectId,
    }));
    void queryClient.prefetchQuery(trpc.projects.getOne.queryOptions({
        id: projectId,
    }));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<div>Loading Project...</div>}>
                <ProjectView projectId={projectId} />
            </Suspense>
        </HydrationBoundary>
    );
};

export default Page;