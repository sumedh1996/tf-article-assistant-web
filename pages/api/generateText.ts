import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
  "Write me a blog post in the style of Paul Graham with the title below. Please make sure the blog post goes in-depth on the topic and shows that the writer did their research.\n";
const finalPromptPrefix = "The Pros and Cons of Large Language Models:\n";

const generateAction = async (req, res) => {
  // Run first prompt
  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: `${basePromptPrefix}${req.body.input}`,
    temperature: 0.7,
    max_tokens: 2048,
  });

  const baseChoice = baseCompletion.data.choices.pop();

  // Run second prompt with prefix
  const finalPrompt = `${finalPromptPrefix}${req.body.input}${baseChoice.text}`;

  const prefixCompletion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: finalPrompt,
    temperature: 0.7,
    max_tokens: 2048,
  });

  const finalChoice = prefixCompletion.data.choices.pop();

  res.status(200).json({ baseChoice, finalChoice });
};

export default generateAction;
