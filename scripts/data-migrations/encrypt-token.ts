// scripts/encrypt-tokens.ts
import { prisma } from "@repo/database";
import { encrypt, decrypt } from "@repo/lib/encrypt";

async function encryptUnsecuredTokens() {
  const integrations = await prisma.integration.findMany({
    where: {
      // Basic heuristic: token does not include ":"
      // If your encrypted format is "iv:encrypted", use this
      NOT: {
        token: {
          contains: ":",
        },
      },
    },
  });

  console.log(`Found ${integrations.length} unsecured tokens`);

  for (const integration of integrations) {
    if (!integration.token) {
      continue;
    }
    try {
      console.log(`Original Token: ${integration.token}\n`);
      console.log(`Encrypted Token: ${encrypt(integration.token)}\n`);
      console.log(`Decrypted Token: ${decrypt(encrypt(integration.token))}\n`);
      const encryptedToken = encrypt(integration.token);
      await prisma.integration.update({
        where: { id: integration.id },
        data: { token: encryptedToken },
      });
      console.log(`Encrypted token for integration ${integration.id}`);
    } catch (err) {
      console.error(`Failed to encrypt token for ID ${integration.id}:`, err);
    }
  }

  console.log("✅ All done!");
  process.exit(0);
}

encryptUnsecuredTokens();
