// "use client";

import { CallTracker } from "assert";
import { text } from "stream/consumers";

// import { useQuery } from "@tanstack/react-query";
// import { useTRPC } from "@/trpc/client";

// const page = () => {

//   const trpc =  useTRPC();
//   const {data} = useQuery(trpc.createAI.queryOptions({text: "Yassin"}));

//   // localhost:3000/api/create-ai?input={text : "hello"}
  
//   return (
//     <div>
//       {JSON.stringify(data)}
//     </div>
//   );
// }

// export default page;


import { getQueryClient, trpc } from "@/trpc/server";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { Client } from "./client";

import { Suspense } from "react";

const page = async () => {
 const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.createAI.queryOptions({ text: "Yassin PREFETCH" }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}>
        <Client />
      </Suspense>
    </HydrationBoundary>
  );
}

export default page;