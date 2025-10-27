import React from 'react';

const DemoModeBanner: React.FC = () => {
  return (
    <div className="bg-yellow-400 text-yellow-900 text-center p-3 text-sm font-semibold">
      <div className="max-w-4xl mx-auto">
        <strong>Demo Mode:</strong> You are viewing a limited version of Spruce because an API key is not configured. 
        AI features are disabled. To enable them, please add your{' '}
        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-800">
          Google AI API Key
        </a>{' '}
        to the `NEXT_PUBLIC_API_KEY` environment variable in your Vercel project settings and redeploy.
      </div>
    </div>
  );
};

export default DemoModeBanner;
