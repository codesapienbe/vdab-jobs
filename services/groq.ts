import Constants from 'expo-constants';

const SYSTEM_PROMPT = `You are a helpful VDAB assistant focused on providing guidance and information about:
1. Job search and career development
2. VDAB services and programs
3. Training and education opportunities
4. Belgian labor market information
5. CV and interview preparation
6. Professional development

Please keep your responses focused on these topics and Belgian context. If asked about unrelated topics, politely redirect the conversation back to VDAB and career-related matters.`;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function sendMessageToGroq(messages: Message[]) {
  const apiKey = Constants.expoConfig?.extra?.groqApiKey;
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured. Please add it to your app.config.js.');
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error?.message || 'Failed to get response from Groq API');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error sending message to Groq:', error);
    throw error;
  }
} 