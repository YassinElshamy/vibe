import { gemini, createAgent } from "@inngest/agent-kit";

import { Sandbox } from "@e2b/code-interpreter";


import { inngest } from "./client";
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxID = await step.run("get sandbox ID", async () => {
      const sandbox = await Sandbox.create("vibe-nextjs-test-yassin");
      return sandbox.sandboxId;
    });



    // Create a new agent with a system prompt (you can add optional tools, too)
    const codeAgent = createAgent({
      name: "code-agent",
      system: "You are an expert next.js developer. You write readable, maintainable code. You write simple next.js & react snippets",
      model: gemini({ model: "gemini-2.0-flash" }),
    });

    const { output } = await codeAgent.run(
      `Write the following snippet: ${event.data.value}`,
    );
    // console.log(output);

    const sandboxUrl = await step.run("get sandbox URL", async () => {
      const sandbox = await getSandbox(sandboxID);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    })
    
    return { output, sandboxUrl};
  },
);