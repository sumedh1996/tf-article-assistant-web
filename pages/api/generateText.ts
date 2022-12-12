import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
  "List me new startup ideas with thought process of stevejobs and gary v\n";
const finalPromptPrefix = "Best startup idea in creator economy:\n";

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
