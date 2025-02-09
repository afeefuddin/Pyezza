import { prisma } from "@repo/database";
import { TMessageTemplate } from "@repo/types/messageTemplate";
import * as readline from "readline";
import { stdin as input, stdout as output } from "process";

const rl = readline.createInterface({ input, output });

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createMessageTemplate(data: {
  type: TMessageTemplate["type"];
  content: string;
  gif?: string;
}) {
  try {
    const template = await prisma.messageTemplate.create({
      data,
    });
    console.log("Successfully created template:", template);
    return template;
  } catch (error) {
    console.error("Error creating template:", error);
    throw error;
  }
}

async function main() {
  try {
    let type: TMessageTemplate["type"];
    const typeInput = await question(`Enter message type : `);

    type = typeInput as TMessageTemplate["type"];

    let content: string;
    while (true) {
      content = await question("Enter message content: ");
      if (content.trim().length > 0) {
        break;
      }
      console.log("Content cannot be empty. Please try again.");
    }

    const includeGif = await question("Do you want to add a GIF? (y/n): ");
    let gif: string | undefined;

    if (includeGif.toLowerCase() === "y") {
      gif = await question("Enter GIF URL: ");
      if (!gif.trim()) {
        gif = undefined;
      }
    }

    await createMessageTemplate({ type, content, gif });
    console.log("Message template created successfully!");
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    rl.close();
  }
}

process.on("SIGINT", () => {
  console.log("\nProgram terminated by user");
  rl.close();
  process.exit(0);
});

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
