import OpenAI from 'openai';

// Lazy initialization or dummy client to prevent build crash
export const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("OpenAI API Key missing, using dummy for build.");
    return new OpenAI({ apiKey: "dummy-key-for-build", dangerouslyAllowBrowser: true });
  }
  return new OpenAI({ apiKey });
};
