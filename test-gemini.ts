import { getAIService } from "./src/lib/ai/index";
import { config } from "dotenv";
config();

async function test() {
  const service = getAIService();
  const result = await service.analyzeRequest("The road near our school has been damaged for three months and becomes dangerous after rain.", "en");
  console.log(JSON.stringify(result, null, 2));
}

test().catch(console.error);
